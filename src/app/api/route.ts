import { nuclei_regex } from "@/constants/constants";
import { NextRequest } from "next/server";
import { getKeys } from "@/lib/gemini-ai";

function get_secret(data: string): string[] {
    const result: string[] = [];
    for (let i = nuclei_regex.length - 1; i >= 0; i--) {
      const tmp_result = data.match(nuclei_regex[i]);
      if (tmp_result !== null) {
        for (const match of tmp_result) {
          result.push(match);
        }
      }
    }
    return result;
  }

  export async function POST(req: NextRequest) {
    const { data } = await req.json();

    console.log(data);

    const header = req.headers.get("x-api-key");


    if(header !== process.env.KEY){
      return new Response("Unauthorized", {
        status: 401,
        headers: { "content-type": "text/plain" },
      });
    };

    const secret = get_secret(data)

    const response = await getKeys(secret.length > 0 ? secret : ["No secret found"]);
    return new Response(JSON.stringify({response, eventId: data.eventId}), {
      headers: { "content-type": "application/json" },
    });
  }