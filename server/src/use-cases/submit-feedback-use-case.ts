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
                `</div>`,
            ].join('\n')
        })
    }
}