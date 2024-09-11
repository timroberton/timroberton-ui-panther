import { createEffect } from "solid-js";
export function StateHolderWrapperX(p) {
    return <div class="">{p.tim}</div>;
}
export function StateHolderWrapper(p) {
    const status = () => p.state.status;
    createEffect(() => {
        console.log("Changing state:", status(), p.state);
    });
    return <div class="">Hmm{JSON.stringify(p.state)}</div>;
    // <div class="h-full w-full">
    //   <Switch>
    //     <Match when={status() === "loading"}>
    //       <Loading />
    //     </Match>
    //     <Match when={status() === "error"}>
    //       <div class="ui-pad ui-space-y">
    //         <div class="text-danger">
    //           Error: {(p.state as { err: string }).err}
    //         </div>
    //         <Switch>
    //           <Match
    //             when={
    //               (p.onErrorButton as { label: string; onClick: () => void })
    //                 ?.onClick &&
    //               (p.onErrorButton as { label: string; onClick: () => void })
    //             }
    //             keyed
    //           >
    //             {(keyedOnErr) => {
    //               return (
    //                 <div class="">
    //                   <Button onClick={keyedOnErr.onClick}>
    //                     {keyedOnErr.label}
    //                   </Button>
    //                 </div>
    //               );
    //             }}
    //           </Match>
    //           <Match
    //             when={
    //               (p.onErrorButton as { label: string; link: string })?.link &&
    //               (p.onErrorButton as { label: string; link: string })
    //             }
    //             keyed
    //           >
    //             {(keyedOnErr) => {
    //               return (
    //                 <div class="">
    //                   <Link href={keyedOnErr.link}>{keyedOnErr.label}</Link>
    //                 </div>
    //               );
    //             }}
    //           </Match>
    //         </Switch>
    //       </div>
    //     </Match>
    //     <Match
    //       when={status() === "ready" && (p.state as { data: T }).data}
    //       keyed
    //     >
    //       {(keyedData) => p.children(keyedData)}
    //     </Match>
    //   </Switch>
    // </div>
}
