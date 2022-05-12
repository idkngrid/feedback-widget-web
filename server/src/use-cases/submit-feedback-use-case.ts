import { MailAdapter } from '../adapters/mail-adapter';
import { FeedbacksRepository } from '../repositories/feeedbacks-repository';
import { PrismaFeedbacksRepository } from '../repositories/prisma/prisma-feedbacks-repository';

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {
    constructor(
        private feedbackRepository: PrismaFeedbacksRepository, private MailAdapter: MailAdapter) {}

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;

        if (screenshot && !screenshot.startsWith('data:image/png;base64')) {
            throw new Error('Invalid screenshot format.');
        }

        if(!type) {
            throw new Error('Type is required.');
        }

        if(!comment) {
            throw new Error('Comment is required.');
        }

        await this.feedbackRepository.create({
            type, 
            comment,
            screenshot
        })

        await this.MailAdapter.sendMail({
            subject: 'Novo feedback',
            body: [
                `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
                `<p>Tipo do feedback: ${type} </p>`, 
                `<p>Comentário: ${comment} </p>`,
                screenshot ? `<img src="${screenshot}" />` : ``,
                `</div>`,
            ].join('\n')
        })
    }
}