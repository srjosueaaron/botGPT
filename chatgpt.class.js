const { CoreClass } = require("@bot-whatsapp/bot");

class ChatGPTClass extends CoreClass{
    queue = [];
    optionsGPT = {model: "gpt-3.5-turbo-instruct"};
    openai = undefined;
     
    constructor(_database, _provider, _optionsGPT = {}){
        super(null, _database, _provider);
          this.init().then();
    }

    init = async () =>{
        const{ ChatGPTAPI } = await import("chatgpt");
        this.openai = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    };

    handleMsg = async(ctx) =>{
        const{from, body} = ctx;

        const completion = await this.openai.sendMessage(body,{
            conversationId: !this.queue.length
            ? undefined
            : this.queue[this.queue.length - 1].conversationId,
            parentMessageId: !this.queue.length
                ? undefined
                : this.queue[this.queue.length -1].id
        });

        this.queue.push(completion);

        const parentMessage = {
            ...completion,
            answer: completion.text,
        };
        this.sendFlowSimple([parentMessage], from);
    };
}

module.exports = ChatGPTClass;