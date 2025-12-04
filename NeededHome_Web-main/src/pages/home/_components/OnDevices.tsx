import { toast } from "sonner";
import FlexInfo from "./FlexInfo";
import { useForm } from "react-hook-form";

export default function GetOnDevices() {
  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
    },
  });
  const { handleSubmit, register } = form;
  return (
    <div className="bg-black  ">
      <div className="contain mx-auto grid px-4 md:px-0 md:grid-cols-2 py-12 bg-black text-white text-center md:text-left">
        <FlexInfo>
          <h2 className="text-4xl font-bold">Download Our Mobile App</h2>
          <div className="space-x-4 gap-2 mx-auto md:mx-0  flex flex-col md:flex-row">
            <button className="btn-white btn  btn-block md:w-auto">
              <img src="apple_dark.svg" alt="" /> Get On Iphone
            </button>
            <button className="btn-white btn  btn-block md:w-auto">
              <img src="google_icon.svg" alt="" /> Get On Android
            </button>
          </div>
        </FlexInfo>
        <FlexInfo>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
              toast.info(JSON.stringify(data));
            })}
            className="bg-base-300 text-base-content p-4 w-full max-w-[390px] md:w-[390px]  md:ml-auto md:mr-0 mx-auto  space-y-3 flex flex-col  ring-primary ring-4 "
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black">NewsLetter</h2>
              <p className="text-lg">Subscribe To Newsletter For Updates</p>
            </div>
            <input
              type="text"
              className="input w-full input-lg mb-4"
              placeholder="Name"
              {...register("name")}
            />
            <input
              type="email"
              className="input w-full input-lg"
              placeholder="Email"
              {...register("email")}
            />
            <button className="btn btn-accent accent max-w-[250px]  w-full mx-auto btn-xl">
              Send
            </button>
          </form>
        </FlexInfo>
      </div>
    </div>
  );
}
