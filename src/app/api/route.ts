import { nuclei_regex } from "@/constants/constants";
import { NextRequest } from "next/server";

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
    const secret = get_secret(data);
    return new Response(JSON.stringify(secret), {
      headers: { "content-type": "application/json" },
    });
  }