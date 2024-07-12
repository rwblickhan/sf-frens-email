/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext/browser';

export default {
	async email(message, env, ctx) {
		const msg = createMimeMessage();
		msg.setHeader('In-Reply-To', message.headers.get('Message-ID')!);
		msg.setSender({ name: 'sf frens', addr: 'zine-submission@sf-frens.org' });
		msg.setRecipient(message.from);
		msg.setSubject('Thanks for your submission!');
		msg.addMessage({
			contentType: 'text/plain',
			data: "We've got it! You'll hear from us soon 😃\n\n- sf frens zine committee",
		});

		const replyMessage = new EmailMessage('zine-submission@sf-frens.org', message.from, msg.asRaw());

		// Apparently @cloudflare/workers-types isn't updated with this function yet...
		await (message as any).reply(replyMessage);
		await message.forward('internal@sf-frens.org');
	},
} satisfies ExportedHandler<Env>;
