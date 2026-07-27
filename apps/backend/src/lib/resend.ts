import { Resend } from "resend";

import { mailConfig } from "../config";

export const resend = new Resend(mailConfig.resend.apiKey);
