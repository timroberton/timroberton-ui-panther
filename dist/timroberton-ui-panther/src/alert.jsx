import { createSignal, Match, Show, Switch } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Button } from "./button";
import { Input } from "./input";
function isACPState(alertState) {
    return alertState?.stateType !== "component";
}
function isAlertState(alertState) {
    return alertState?.stateType === "alert";
}
function isConfirmState(alertState) {
    return alertState?.stateType === "confirm";
}
function isPromptState(alertState) {
    return alertState?.stateType === "prompt";
}
function isComponentState(alertState) {
    return alertState?.stateType === "component";
}
const [alertState, setAlertState] = createSignal(undefined);
export async function openAlert(v) {
    return new Promise((resolve, reject) => {
        setAlertState({
            ...v,
            stateType: "alert",
            alertResolver: resolve,
        });
    });
}
export async function openConfirm(v) {
    return new Promise((resolve, reject) => {
        setAlertState({
            ...v,
            stateType: "confirm",
            confirmResolver: resolve,
        });
    });
}
export async function openPrompt(v) {
    return new Promise((resolve, reject) => {
        setAlertState({
            ...v,
            stateType: "prompt",
            promptResolver: resolve,
        });
    });
}
export async function openComponent(v) {
    return new Promise((resolve, reject) => {
        setAlertState({
            ...v,
            stateType: "component",
            componentResolver: resolve,
        });
    });
}
export default function AlertProvider() {
    function cancelAny() {
        const ass = alertState();
        if (isAlertState(ass)) {
            ass.alertResolver();
        }
        if (isConfirmState(ass)) {
            ass.confirmResolver(false);
        }
        if (isPromptState(ass)) {
            ass.promptResolver(undefined);
        }
        if (isComponentState(ass)) {
            ass.componentResolver(undefined);
        }
        setAlertState(undefined);
    }
    return (<Show when={alertState()} keyed>
      {(keyedAlertState) => {
            return (<>
            <div class="fixed inset-0 z-50 bg-black bg-opacity-30"/>
            <div class="fixed inset-0 z-50 flex items-center justify-center">
              <Switch>
                <Match when={isComponentState(keyedAlertState) && keyedAlertState} keyed>
                  {(keyedComponentState) => {
                    return (<div class="ui-never-focusable z-50 rounded bg-base-100 shadow-lg outline-none">
                        <Dynamic component={keyedComponentState.element} close={(p) => {
                            keyedComponentState.componentResolver(p);
                            setAlertState(undefined);
                        }} {...keyedComponentState.elementProps}/>
                      </div>);
                }}
                </Match>
                <Match when={isACPState(keyedAlertState) && keyedAlertState} keyed>
                  {(keyedACPState) => {
                    return (<div class="ui-pad ui-alert-w ui-never-focusable z-50 rounded bg-base-100 shadow-lg">
                        <div class="ui-space-y">
                          <Show when={keyedACPState.title || keyedACPState.text}>
                            <div class="space-y-3">
                              <Show when={keyedACPState.title} keyed>
                                {(keyedTitle) => {
                            return (<h2 class="text-lg font-700 leading-6 data-primary:text-primary data-neutral:text-neutral data-success:text-success data-danger:text-danger" data-intent={keyedACPState.intent}>
                                      {keyedTitle}
                                    </h2>);
                        }}
                              </Show>
                              <Show when={keyedACPState.text} keyed>
                                {(keyedText) => {
                            return (<Switch>
                                      <Match when={typeof keyedText === "string"}>
                                        <p class="">{keyedText}</p>
                                      </Match>
                                      <Match when={true}>{keyedText}</Match>
                                    </Switch>);
                        }}
                              </Show>
                            </div>
                          </Show>
                          <Switch>
                            <Match when={isAlertState(keyedACPState) && keyedACPState} keyed>
                              {(keyedAlertState) => {
                            return (<div class="">
                                    <Button onClick={() => {
                                    keyedAlertState.alertResolver();
                                    setAlertState(undefined);
                                }} intent={keyedAlertState.intent}>
                                      {keyedAlertState.closeButtonLabel ??
                                    "Close"}
                                    </Button>
                                  </div>);
                        }}
                            </Match>
                            <Match when={isConfirmState(keyedACPState) && keyedACPState} keyed>
                              {(keyedConfirmState) => {
                            return (<div class="ui-space-x-sm">
                                    <Button onClick={() => {
                                    keyedConfirmState.confirmResolver(true);
                                    setAlertState(undefined);
                                }} intent={keyedConfirmState.intent}>
                                      {keyedConfirmState.confirmButtonLabel ??
                                    "Confirm"}
                                    </Button>
                                    <Button onClick={() => {
                                    keyedConfirmState.confirmResolver(false);
                                    setAlertState(undefined);
                                }} intent="neutral" autofocus>
                                      Cancel
                                    </Button>
                                  </div>);
                        }}
                            </Match>
                            <Match when={isPromptState(keyedACPState) && keyedACPState} keyed>
                              {(keyedPromptState) => {
                            return (<InnerForPrompt pst={alertState()} close={(v) => {
                                    keyedPromptState.promptResolver(v);
                                    setAlertState(undefined);
                                }}/>);
                        }}
                            </Match>
                          </Switch>
                        </div>
                      </div>);
                }}
                </Match>
              </Switch>
            </div>
          </>);
        }}
    </Show>);
}
function InnerForPrompt(props) {
    const [promptInput, setPromptInput] = createSignal(props.pst.initialInputText);
    return (<form id="promptForm" class="ui-space-y w-full">
      <Input label={props.pst.inputLabel} value={promptInput()} onChange={(v) => setPromptInput(v)} autoFocus fullWidth/>
      <div class="ui-space-x-sm">
        <Button type="submit" form="promptForm" onClick={(evt) => {
            evt.preventDefault();
            props.close(promptInput());
        }} intent={props.pst.intent}>
          {props.pst.saveButtonLabel ?? "Confirm"}
        </Button>
        <Button type="button" onClick={(evt) => {
            evt.preventDefault();
            props.close(undefined);
        }} intent="neutral">
          Cancel
        </Button>
      </div>
    </form>);
}
