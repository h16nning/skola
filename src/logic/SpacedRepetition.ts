import { Card, CardType } from "./card";

export function sm2(quality: number, model: ReviewModel): ReviewModel {
  const newModel: ReviewModel = structuredClone(model);

  if (quality >= 3) {
    if (model.repetitions === 0) {
      newModel.interval = 0;
    } else if (model.repetitions === 1) {
      //interval of 1 for quality = 3 and interval of 3 for quality = 5
      newModel.interval = quality - 2;
    } else {
      if (model.interval === 0) {
        newModel.interval = 1;
      } else {
        newModel.interval = Math.ceil(model.interval * model.easeFactor);
      }
    }
    newModel.repetitions++;
    newModel.easeFactor =
      model.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else if (quality === 0) {
    newModel.repetitions = 0;
    newModel.interval = 0;
  } else if (quality < 3) {
    if (model.repetitions === 0) {
      newModel.interval = 0;
    } else {
      newModel.repetitions = 0;
      newModel.interval = 1;
    }
  }
  if (newModel.easeFactor < 1.3) {
    newModel.easeFactor = 1.3;
  }
  return newModel;
}

export function testSM2(startModel: ReviewModel, qualitySequence: number[]) {
  let model = startModel;
  console.log("--------------------");
  console.log("Starting SM2 test");
  console.log("Interval: " + model.interval);
  for (const quality of qualitySequence) {
    console.log("Simulate answer of: " + quality);
    model = sm2(quality, model);
    console.log("Interval is now:");
    console.log(model.interval);
  }
  console.log("SM2 test finished");
  console.log("--------------------");
  return model;
}

export function updateModel(quality: number, card: Card<CardType>) {
  card.model = sm2(quality, card.model);
}
export type ReviewModel = {
  interval: number;
  learned: boolean;
  repetitions: number;
  easeFactor: number;
};
