import { Schema, model, type InferSchemaType } from "mongoose";

const chatbotSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    enabled: { type: Boolean, default: true },
    botName: { type: String, default: "Remit2Nepal Assist" },
    welcomeMessage: {
      type: String,
      default:
        "Hello. Ask me anything about Remit2Nepal — agents, DC install, rates, directors, Our Team, and the content on this site."
    },
    placeholder: { type: String, default: "Ask anything about Remit2Nepal..." },
    fallbackMessage: {
      type: String,
      default:
        "I could not find that in our agent desk yet. Try one of the questions below, or contact us and the operations team will help."
    },
    launcherLabel: { type: String, default: "Agent help" },
    sectionKicker: { type: String, default: "Agent desk" },
    sectionTitle: { type: String, default: "Ask the agent assistant" },
    sectionDescription: {
      type: String,
      default:
        "Ask about becoming an agent, DC install, rates, branches, directors, Our Team, fees, and anything published on this website."
    },
    suggestedQuestions: {
      type: [String],
      default: [
        "How do I become an agent?",
        "How do I install DC?",
        "Who are the directors?",
        "Who is on Our Team?",
        "What is the USD rate?",
        "Where can I find a branch?"
      ]
    }
  },
  { timestamps: true }
);

export type ChatbotSettingDocument = InferSchemaType<typeof chatbotSettingSchema>;
export const ChatbotSetting = model("ChatbotSetting", chatbotSettingSchema);
