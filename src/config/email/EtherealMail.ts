import nodemailer from 'nodemailer';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';

interface IMailContact {
    name: string;
    email: string;
}

interface ITemplateVariables {
    [key: string]: string | number;
}

interface IParseMailTemplate {
    template: string;
    variables: ITemplateVariables;
}

interface ISendMail {
    to: IMailContact;
    from?: IMailContact;
    subject: string
    templateDate: IParseMailTemplate;
}

export default class EtherealMail {
    static async sendMail({to, from, subject, templateDate}: ISendMail): Promise<void> {
        const account = await nodemailer.createTestAccount();

        const mailTemplate = new HandlebarsMailTemplate();

        const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            }
            });
        const message = await transporter.sendMail({
            from: {
                name: from?.name || 'Equipe Api Vendas',
                address: from?.email || 'apivendas@email.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await mailTemplate.parse(templateDate),
        })
        console.log('Message sent: %s', message.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
    }
}
