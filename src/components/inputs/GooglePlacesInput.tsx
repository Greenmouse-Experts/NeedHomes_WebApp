import { useEffect, useRef, useState } from "react";
import { MapPin, Loader } from "lucide-react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export interface PlaceData {
  location: string;
  country: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface GooglePlacesInputProps {
  label?: string;
  required?: boolean;
  value?: string;
  onLocationChange: (data: PlaceData) => void;
  placeholder?: string;
  error?: string;
}

declare const google: any;

let scriptLoadPromise: Promise<void> | null = null;
let mapsLoadError: string | null = null;
const errorListeners: Array<(err: string) => void> = [];

function isMapsLoaded() {
  return (
    typeof window !== "undefined" &&
    typeof (window as any).google?.maps?.places !== "undefined"
  );
}

function loadGoogleMapsScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  if (isMapsLoaded()) {
    scriptLoadPromise = Promise.resolve();
    return scriptLoadPromise;
  }

  // Google Maps calls this global on auth/activation errors
  (window as any).gm_authFailure = () => {
    const msg = "Google Maps API key is invalid or Maps API is not activated.";
    mapsLoadError = msg;
    errorListeners.forEach((fn) => fn(msg));
    scriptLoadPromise = null;
  };

  scriptLoadPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GREEN_MOUSE_KEY;
    // console.log(apiKey, "api_key");
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      const msg = "Failed to load Google Maps. Check your network connection.";
      mapsLoadError = msg;
      errorListeners.forEach((fn) => fn(msg));
      scriptLoadPromise = null;
      reject(new Error(msg));
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

function useGoogleMapsLoaded(): { loaded: boolean; mapsError: string | null } {
  const [loaded, setLoaded] = useState(() => isMapsLoaded());
  const [error, setError] = useState<string | null>(() => mapsLoadError);

  useEffect(() => {
    if (loaded) return;

    const onError = (msg: string) => setError(msg);
    errorListeners.push(onError);

    loadGoogleMapsScript()
      .then(() => setLoaded(true))
      .catch(() => {});

    return () => {
      const idx = errorListeners.indexOf(onError);
      if (idx !== -1) errorListeners.splice(idx, 1);
    };
  }, []);

  return { loaded, mapsError: error };
}

function getAddressComponent(
  components: { types: string[]; long_name: string }[],
  type: string,
): string | null {
  const found = components.find((c) => c.types.includes(type));
  return found ? found.long_name : null;
}

export default function GooglePlacesInput({
  label,
  required,
  value,
  onLocationChange,
  placeholder = "Lekki Phase 1, Lagos",
  error,
}: GooglePlacesInputProps) {
  const { loaded: mapsLoaded, mapsError } = useGoogleMapsLoaded();
  const [isOpen, setIsOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ["geocode", "establishment"] },
    debounce: 300,
    defaultValue: value ?? "",
    initOnMount: mapsLoaded,
  });

  // Sync external value on load (e.g. edit form)
  const syncedRef = useRef(false);
  useEffect(() => {
    if (!syncedRef.current && value && value !== inputValue) {
      setValue(value, false);
      syncedRef.current = true;
    }
  }, [value]);

  const handleSelect = async (description: string) => {
    setIsSelecting(true);
    setValue(description, false);
    clearSuggestions();
    setIsOpen(false);

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      const components = results[0].address_components;

      onLocationChange({
        location: description,
        country: getAddressComponent(components, "country"),
        state:
          getAddressComponent(components, "administrative_area_level_1") ??
          getAddressComponent(components, "administrative_area_level_2"),
        latitude: lat,
        longitude: lng,
      });
    } catch {
      onLocationChange({
        location: description,
        country: null,
        state: null,
        latitude: null,
        longitude: null,
      });
    } finally {
      setIsSelecting(false);
    }
  };

  const hasSuggestions = status === "OK" && data.length > 0;

  useEffect(() => {
    setIsOpen(hasSuggestions);
  }, [hasSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full space-y-2" ref={containerRef}>
      {label && (
        <div className="fieldset-label font-semibold">
          <span className="text-sm">
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </span>
        </div>
      )}

      <div className="relative">
        <div
          className={`input input-md text-sm input-bordered flex items-center gap-2 w-full ${
            mapsError || error ? "input-error" : ""
          }`}
        >
          {isSelecting ? (
            <Loader size={16} className="animate-spin opacity-50 shrink-0" />
          ) : (
            <MapPin size={16} className="opacity-50 shrink-0" />
          )}
          <input
            value={inputValue}
            onChange={(e) => {
              setValue(e.target.value);
              if (e.target.value === "") {
                onLocationChange({
                  location: "",
                  country: null,
                  state: null,
                  latitude: null,
                  longitude: null,
                });
              }
            }}
            onFocus={() => hasSuggestions && setIsOpen(true)}
            disabled={!ready || !!mapsError}
            placeholder={
              mapsError
                ? "Maps unavailable"
                : !ready
                  ? "Loading..."
                  : placeholder
            }
            className="grow outline-none bg-transparent"
          />
        </div>

        {isOpen && (
          <ul className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg overflow-hidden">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onMouseDown={() => handleSelect(description)}
                className="flex items-start gap-2 px-4 py-3 text-sm cursor-pointer hover:bg-base-200 transition-colors"
              >
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-primary opacity-70"
                />
                <span>{description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {mapsError && <p className="text-error text-sm mt-1">{mapsError}</p>}
      {!mapsError && error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
