import { useForm, type UseFormProps } from "react-hook-form";

export default function DefaultForm<T = any>({
  form,
}: {
  //@ts-ignore
  form: ReturnType<typeof useForm<T>>;
}) {
  return <div></div>;
}
