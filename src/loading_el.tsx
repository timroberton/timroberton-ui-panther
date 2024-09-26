type Props = {
  msg?: string;
};

export function Loading(p: Props) {
  return <div class="ui-pad h-full w-full">{p.msg ?? "Loading..."}</div>;
}
