import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {}


// import { Injectable } from '@nestjs/common';
// import { ActivityHandler, BotFrameworkAdapter } from 'botbuilder';
// import { Inject } from '@nestjs/common';
// import { BOT_CONFIGURATION } from './bot.module';
// import { HttpService } from '@nestjs/common/http'; // Import HttpService for potential API calls (optional)

// @Injectable()
// export class BotService extends ActivityHandler {
//   private readonly adapter: BotFrameworkAdapter;

//   constructor(
//     @Inject(BOT_CONFIGURATION) private readonly botConfig: { appId: string; appPassword: string },
//     private readonly httpService: HttpService, // Optional for API calls
//   ) {
//     super();
//     this.adapter = new BotFrameworkAdapter(this.botConfig);
//   }

//   async handleIncomingMessage(message: any) {
//     try {
//       await this.adapter.processActivity(message, async (context) => {
//         // Handle incoming messages from Skype (not used in this example)
//         return await context.sendActivity('Processing...');
//       });
//     } catch (error) {
//       console.error('Error processing incoming message:', error);
//     }
//   }

//   async sendNotification(managerEmail: string, message: string) {
//     try {
//       // Replace with your logic to find the manager in Skype (using email or username)
//       const managerSkypeUsername = await this.findManagerSkypeUsername(managerEmail);
//       if (!managerSkypeUsername) {
//         console.warn('Manager not found on Skype:', managerEmail);
//         return;
//       }

//       // Send message with Skype mention
//       const notificationMessage = `Hi @${managerSkypeUsername}, ${message}`;
//       await this.adapter.sendActivity({ text: notificationMessage });
//     } catch (error) {
//       console.error('Error sending Skype notification:', error);
//     }
//   }

//   // New method to find manager's Skype username (replace with your implementation)
//   async findManagerSkypeUsername(managerEmail: string) {
//     // Consider these approaches (choose the most suitable for your setup):
//     // 1. Internal Data Source (Database, Directory Service):
//     //    - Replace with a call to your service to retrieve the username based on email.
//     // 2. External API (if your data resides in a separate system):
//     //    - Use HttpService to make an API call to retrieve the username.
//     //    - Ensure proper authentication and authorization for the API call.

//     console.warn('Manager Skype username retrieval not implemented yet');
//     return null;
//   }
// }
