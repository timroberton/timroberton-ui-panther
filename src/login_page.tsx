// import { SupabaseClient } from "@supabase/supabase-js";
import { createSignal, JSX, onMount, Show } from "solid-js";
import { Button } from "./button";
// import { Input } from "./input";

type APIResponseWithData<T> =
  | { success: true; data: T }
  | { success: false; err: string };

type APIResponseNoData = { success: true } | { success: false; err: string };

type LoggedInInfo =
  | {
      user: unknown;
      logout: () => Promise<void>;
    }
  | undefined;

const [loggedInInfo, setLoggedInInfo] = createSignal<LoggedInInfo>(undefined);

async function logout() {
  try {
    const res = await fetch("http://localhost:8000/logout", {
      method: "GET",
      credentials: "include",
    });
    setLoggedInInfo(undefined);
  } catch {}
}

export { loggedInInfo };

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type LoginViewState = "signin" | "register" | "resetpasswordrequest";

export type LoginPageProps = LoginPagePropsSignInRegisterResetPasswordRequest;
// | LoginPagePropsResetPasswordForm;

type LoginPagePropsSignInRegisterResetPasswordRequest = {
  type: "login";
  // supabaseBrowserClient: SupabaseClient<any>;
  logoLinkElement?: JSX.Element;
  resetPasswordRedirectUrl: string;
};

// type LoginPagePropsResetPasswordForm = {
//   type: "resetpasswordform";
//   // supabaseBrowserClient: SupabaseClient<any>;
//   logoLinkElement?: JSX.Element;
//   afterResetPassword: () => void;
// };

export function LoginPage(p: LoginPageProps) {
  const [loginViewState, setLoginViewState] =
    createSignal<LoginViewState>("signin");

  const [alreadyChecked, setAlreadyChecked] = createSignal<boolean>(false);

  onMount(async () => {
    // Check not already logged in
    try {
      const res = await fetch("http://localhost:8000/user", {
        method: "GET",
        credentials: "include",
      });
      const jRes = await res.json();
      if (jRes.success == false) {
        setAlreadyChecked(true);
        return;
      }
      setLoggedInInfo({
        status: "logged-in",
        user: jRes.data,
        logout,
      });
    } catch {
      setAlreadyChecked(true);
    }
  });

  return (
    <Show when={alreadyChecked()}>
      <main class="flex h-screen w-full items-start justify-center">
        <div class="text-400 min-h-full w-full space-y-4 rounded bg-base-200 px-12 py-10 text-base-content sm:mt-24 sm:min-h-0 sm:w-96">
          {p.logoLinkElement && (
            <div class="w-full text-center">{p.logoLinkElement}</div>
          )}
          {/* {p.type === "resetpasswordform" ? (
          <ResetPasswordForm
            changeLoginViewState={(v) => setLoginViewState(v)}
            // supabase={p.supabaseBrowserClient}
            afterResetPassword={p.afterResetPassword}
          />
        ) : ( */}

          {loginViewState() === "signin" && (
            <SignInForm
              changeLoginViewState={(v) => setLoginViewState(v)}
              // supabase={p.supabaseBrowserClient}
            />
          )}
          {loginViewState() === "register" && (
            <RegisterForm
              changeLoginViewState={(v) => setLoginViewState(v)}
              // supabase={p.supabaseBrowserClient}
            />
          )}
          {loginViewState() === "resetpasswordrequest" && (
            <ResetPasswordRequest
              changeLoginViewState={(v) => setLoginViewState(v)}
              // supabase={p.supabaseBrowserClient}
              resetPasswordRedirectUrl={p.resetPasswordRedirectUrl}
            />
          )}
          {/* )} */}
        </div>
      </main>
    </Show>
  );
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

type LoginPageFormPropsSignInRegister = {
  changeLoginViewState: (v: LoginViewState) => void;
  // supabase: SupabaseClient;
};

function SignInForm(p: LoginPageFormPropsSignInRegister) {
  const [loading, setLoading] = createSignal<boolean>(false);
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [errorMsg, setErrorMsg] = createSignal<string>("");

  onMount(() => {
    focusFirstInput();
  });

  async function submit(evt: MouseEvent) {
    evt.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const cleanEmail = email().trim().toLowerCase();
    const cleanPassword = password().trim();
    if (!cleanEmail || !cleanPassword) {
      setErrorMsg("You must enter an email and password");
      setLoading(false);
      setLoggedInInfo(undefined);
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
        credentials: "include",
      });
      const jRes: APIResponseWithData<unknown> = await res.json();
      if (jRes.success === false) {
        setErrorMsg(jRes.err);
        setLoading(false);
        setLoggedInInfo(undefined);
        return;
      }
      setLoggedInInfo({
        status: "logged-in",
        user: jRes.data,
        logout,
      });
    } catch {
      setErrorMsg("Problem with sign in");
      setLoading(false);
      setLoggedInInfo(undefined);
    }
  }

  return (
    <form id="signInForm" class="space-y-4">
      <FormHeader>Sign in to use the platform</FormHeader>
      {loading() ? (
        <div class="text-center">Signing in...</div>
      ) : (
        <>
          {/* <Input
            label="Email"
            fullWidth
            type="email"
            // autocomplete="email"
            value={email()}
            onChange={setEmail}
            autofocus
          />
          <Input
            label="Password"
            fullWidth
            type="password"
            // autocomplete="current-password"
            value={password()}
            onChange={setPassword}
          /> */}
          <Button
            // class="w-full"
            fullWidth
            type="submit"
            form="signInForm"
            onClick={submit}
          >
            Sign in
          </Button>
          {errorMsg() && (
            <div class="text-center text-danger">{errorMsg()}</div>
          )}
          <div class="space-y-2">
            <SpanButton onClick={() => p.changeLoginViewState("register")}>
              Don't have an account?
            </SpanButton>
            <SpanButton
              onClick={() => p.changeLoginViewState("resetpasswordrequest")}
            >
              Forgot password?
            </SpanButton>
          </div>
        </>
      )}
    </form>
  );
}

function RegisterForm(p: LoginPageFormPropsSignInRegister) {
  const [loading, setLoading] = createSignal<boolean>(false);
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [firstName, setFirstName] = createSignal<string>("");
  const [lastName, setLastName] = createSignal<string>("");
  const [errorMsg, setErrorMsg] = createSignal<string>("");

  onMount(() => {
    focusFirstInput();
  });

  async function submit(evt: MouseEvent) {
    evt.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const cleanEmail = email().trim().toLowerCase();
    const cleanPassword = password().trim();
    const cleanFirstName = firstName().trim();
    const cleanLastName = lastName().trim();
    if (!cleanEmail || !cleanPassword || !cleanFirstName || !cleanLastName) {
      setErrorMsg("You must enter all fields");
      setLoading(false);
      setLoggedInInfo(undefined);
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
          firstName: cleanFirstName,
          lastName: cleanLastName,
        }),
        credentials: "include",
      });
      const jRes: APIResponseWithData<unknown> = await res.json();
      if (jRes.success === false) {
        setErrorMsg(jRes.err);
        setLoading(false);
        setLoggedInInfo(undefined);
        return;
      }
      setLoggedInInfo({
        status: "logged-in",
        user: jRes.data,
        logout,
      });
    } catch {
      setErrorMsg("Problem with sign in");
      setLoading(false);
      setLoggedInInfo(undefined);
    }
  }

  return (
    <form id="registerForm" class="space-y-4">
      <FormHeader>Create an account to use the platform</FormHeader>
      {loading() ? (
        <div class="text-center">Creating an account...</div>
      ) : (
        <>
          {/* <Input
            label="Email"
            type="email"
            // autocomplete="email"
            value={email()}
            onChange={setEmail}
            autofocus
            fullWidth
          />
          <Input
            label="Password"
            type="password"
            // autocomplete="new-password"
            value={password()}
            onChange={setPassword}
            fullWidth
          />
          <Input
            label="First name"
            type="text"
            // autocomplete="given-name"
            value={firstName()}
            onChange={setFirstName}
            fullWidth
          />
          <Input
            label="Last name"
            type="text"
            // autocomplete="family-name"
            value={lastName()}
            onChange={setLastName}
            fullWidth
          /> */}
          <Button type="submit" form="registerForm" onClick={submit} fullWidth>
            Create account
          </Button>
          {errorMsg() && (
            <div class="text-center text-danger">{errorMsg()}</div>
          )}
          <SpanButton onClick={() => p.changeLoginViewState("signin")}>
            Already have an account?
          </SpanButton>
        </>
      )}
    </form>
  );
}

type LoginPageFormPropsResetPasswordRequest = {
  changeLoginViewState: (v: LoginViewState) => void;
  // supabase: SupabaseClient;
  resetPasswordRedirectUrl: string;
};

type ResetPasswordRequestViewState =
  | "userentry"
  | "sending"
  | "finishedsending";

function ResetPasswordRequest(p: LoginPageFormPropsResetPasswordRequest) {
  const [rprViewState, setRprViewState] =
    createSignal<ResetPasswordRequestViewState>("userentry");
  const [email, setEmail] = createSignal<string>("");
  const [errorMsg, setErrorMsg] = createSignal<string>("");

  onMount(() => {
    focusFirstInput();
  });

  async function submit(evt: MouseEvent) {
    evt.preventDefault();
    setRprViewState("sending");
    setErrorMsg("");
    // const { error } = await p.supabase.auth.resetPasswordForEmail(email(), {
    //   redirectTo: p.resetPasswordRedirectUrl,
    // });
    // if (error) {
    //   setRprViewState("userentry");
    //   setErrorMsg(error?.message ?? "Problem sending email");
    //   return;
    // }
    // setRprViewState("finishedsending");
  }

  return (
    <form id="resetPasswordRequestForm" class="space-y-4">
      <FormHeader>Reset your password</FormHeader>
      {rprViewState() === "finishedsending" ? (
        <div class="text-center">
          Email sent! Check your email for a link to reset your password.
        </div>
      ) : rprViewState() === "sending" ? (
        <div class="text-center">Sending email...</div>
      ) : (
        <>
          <div class="text-sm text-base-content-lighter">
            Send a link to your email account, which you can use to reset your
            password.
          </div>
          {/* <Input
            rootId="email"
            label="Email"
            type="email"
            autocomplete="email"
            value={email()}
            onInput={(v) => setEmail(v.currentTarget.value)}
            autofocus
          />
          <Button
            class="w-full"
            onClick={submit}
            type="submit"
            form="resetPasswordRequestForm"
          >
            Send email
          </Button> */}
          {errorMsg() && (
            <div class="text-center text-danger">{errorMsg()}</div>
          )}
          <SpanButton onClick={() => p.changeLoginViewState("signin")}>
            Remember your password?
          </SpanButton>
        </>
      )}
    </form>
  );
}

type LoginPageFormPropsRequestPasswordForm = {
  changeLoginViewState: (v: LoginViewState) => void;
  // supabase: SupabaseClient;
  afterResetPassword: () => void;
};

function ResetPasswordForm(p: LoginPageFormPropsRequestPasswordForm) {
  const [loading, setLoading] = createSignal<boolean>(false);
  const [password, setPassword] = createSignal<string>("");
  const [linkErrorMsg, setLinkErrorMsg] = createSignal<string>("");
  const [userErrorMsg, setUserErrorMsg] = createSignal<string>("");

  onMount(() => {
    focusFirstInput();
  });

  onMount(() => {
    // Try to get error message from url (i.e. from supabase)
    const hashParams = getHashParams();
    if (hashParams["error_description"]) {
      setLinkErrorMsg(hashParams["error_description"]);
    }
  });

  async function submit(evt: MouseEvent) {
    evt.preventDefault();
    // Try to get error message from url (i.e. from supabase)
    const hashParams = getHashParams();
    if (hashParams["error_description"]) {
      setLinkErrorMsg(hashParams["error_description"]);
      return;
    }
    setLoading(true);
    setUserErrorMsg("");
    // const { error } = await p.supabase.auth.updateUser({
    //   password: password(),
    // });
    // if (error) {
    //   if (error?.message === "Auth session missing!") {
    //     setLinkErrorMsg("Email link is invalid or has expired");
    //     return;
    //   }
    //   setUserErrorMsg(error?.message ?? "Problem resetting password");
    //   setLoading(false);
    //   return;
    // }
    // p.afterResetPassword();
  }

  return (
    <form id="resetPasswordForm" class="space-y-4">
      {linkErrorMsg() ? (
        <div class="text-center text-danger">{linkErrorMsg()}</div>
      ) : (
        <>
          <FormHeader>Enter a new password here</FormHeader>
          {loading() ? (
            <div class="text-center">Resetting password...</div>
          ) : (
            <>
              {/* <Input
                rootId="newPassword"
                label="New password"
                type={"password"}
                autocomplete="new-password"
                value={password()}
                onInput={(v) => setPassword(v.currentTarget.value)}
                autofocus
              />
              <Button
                class="w-full"
                onClick={submit}
                type="submit"
                form="resetPasswordForm"
              >
                Save
              </Button> */}
              {userErrorMsg() && (
                <div class="text-center text-danger">{userErrorMsg()}</div>
              )}
            </>
          )}
        </>
      )}
    </form>
  );
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function getHashParams(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }
  return window.location.hash
    .substring(1)
    .split("&")
    .map((a) => a.split("="))
    .reduce<Record<string, string>>((params, val) => {
      if (val[0] && val[1]) {
        params[val[0]] = val[1].replaceAll("+", " ");
      }
      return params;
    }, {});
}

function SpanButton(p: { onClick: () => void; children: JSX.Element }) {
  return (
    <div class="text-center">
      <button
        class="inline-block cursor-pointer text-sm text-base-content-lighter hover:underline focus-visible:underline focus-visible:outline-none"
        onClick={p.onClick}
      >
        {p.children}
      </button>
    </div>
  );
}

function FormHeader(p: { children: JSX.Element }) {
  return (
    <div class="text-center text-lg font-700 text-primary">{p.children}</div>
  );
}

function focusFirstInput() {
  document.getElementsByTagName("input")?.[0]?.focus();
}
