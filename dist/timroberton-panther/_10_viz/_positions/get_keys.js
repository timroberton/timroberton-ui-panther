import { IncomingOutgoing } from "./types.ts";
export function getKeyInOutNext(incomingOutgoing, nextNodeId) {
    switch (incomingOutgoing) {
        case IncomingOutgoing.Incoming:
            return "incoming-fromnext-" + nextNodeId;
        case IncomingOutgoing.Outgoing:
            return "outgoing-tonext-" + nextNodeId;
        default:
            throw new Error("Not possible");
    }
}
