import { blockListener } from "./block";
import { listener } from "./listener";

listener.register("block", blockListener);

export { listener };
