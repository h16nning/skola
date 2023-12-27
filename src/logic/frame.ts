import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

/**
 * Frame serves a shared container for cards with common content.
 */
export interface Frame {
    id: string;
    cards: string[];
}

/**
 * Creates a new frame and returns its id.
 * @param content frame content
 * @returns frame id
 */
/*export function createFrame(content: Object): string {
    const id = uuidv4();
    db.frames.add({ id, cards: [], ...content });
    return id;
}

export function useFrame(id: string | undefined) {
    return useLiveQuery(() => {
        if (id !== undefined) {
            return db.frames.get(id);
        } else {
            return undefined;
        }
    }, [id]);
}

export async function getFrame(frame: string): Promise<Frame | undefined> {
    return await db.frames.get(frame);
}

/**
 * Links a card to the frame. The card will be added to the frame's card list. It will also link the frame to the card.
 * @param frame frame id
 * @param card card id
 * @throws Error if frame or card is not found, or if the card is already linked to a frame
 */
/*export async function linkCardToFrame(frame: string, card: string) {
    let frameObj = await db.frames.get(frame);
    let cardObj = await db.cards.get(card);
    if (frameObj === undefined) {
        throw new Error("Frame not found");
    } else if (cardObj === undefined) {
        throw new Error("Card not found");
    } else if (cardObj.frame !== undefined) {
        throw new Error("Card already linked to a frame");
    }
    db.frames.update(frame, { cards: [...frameObj?.cards, card] });
    db.cards.update(card, { frame: frame });
}
*/
/**
 * Unlinks a card from the frame. The card will be removed from the frame's card list. It will also unlink the frame from the card.
 * @param frame frame id
 * @param card card id
 * @throws Error if frame or card is not found, or if the card is not linked to the frame
 *
 */
/*export async function unlinkCardFromFrame(frame: string, card: string) {
    let frameObj = await db.frames.get(frame);
    let cardObj = await db.cards.get(card);
    if (frameObj === undefined) {
        throw new Error("Frame not found");
    } else if (cardObj === undefined) {
        throw new Error("Card not found");
    } else if (cardObj.frame !== frame) {
        throw new Error("Card not linked to frame");
    }
    db.frames.update(frame, {
        cards: frameObj?.cards.filter((c) => c !== card),
    });
    db.cards.update(card, { frame: undefined });
}

/**
 * Deletes a frame. All cards linked to the frame will be unlinked.
 * @param frame frame id
 * @throws Error if frame is not found
 */
/*export async function deleteFrame(frame: string) {
    let frameObj = await db.frames.get(frame);
    if (frameObj === undefined) {
        throw new Error("Frame not found");
    }
    for (let card of frameObj.cards) {
        db.cards.update(card, { frame: undefined });
    }
    db.frames.delete(frame);
}

export interface ClozeFrame extends Frame {
    text: string;
    occlusions: [{ id: string; occlusion: string }];
}
*/