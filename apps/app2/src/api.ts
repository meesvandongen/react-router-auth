import { $Fetch } from "ofetch";

export async function getSomething(instance: $Fetch) {
  return instance("/api/something");
}
