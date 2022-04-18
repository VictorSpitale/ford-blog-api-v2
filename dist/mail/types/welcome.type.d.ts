export interface WelcomeEmailInfos {
    mailTo: string;
    pseudo: string;
}
export interface WelcomeEmailType extends WelcomeEmailInfos {
    clientUrl: string;
}
