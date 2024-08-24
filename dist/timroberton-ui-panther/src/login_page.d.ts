import { JSX } from "solid-js";
declare const loggedInInfo: import("solid-js").Accessor<{
    user: unknown;
    logout: () => Promise<void>;
}>;
export { loggedInInfo };
export type LoginPageProps = LoginPagePropsSignInRegisterResetPasswordRequest;
type LoginPagePropsSignInRegisterResetPasswordRequest = {
    type: "login";
    logoLinkElement?: JSX.Element;
    resetPasswordRedirectUrl: string;
};
export declare function LoginPage(p: LoginPageProps): JSX.Element;
