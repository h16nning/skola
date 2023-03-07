export function sm2(quality: number, model: ReviewModel): ReviewModel {
  if (quality >= 3) {
    if (model.repetitions === 0) {
      model.interval = 0;
    } else if (model.repetitions === 1) {
      model.interval = 1;
    } else {
      model.interval = Math.ceil(model.interval * model.easeFactor);
    }
    model.repetitions++;
    model.easeFactor =
      model.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else if (quality === 0) {
    model.repetitions = 0;
    model.interval = 0;
  } else if (quality < 3) {
    model.repetitions = 0;
    model.interval = 1;
  }
  if (model.easeFactor < 1.3) {
    model.easeFactor = 1.3;
  }
  return model;
}

export type ReviewModel = {
  interval: number;
  learned: boolean;
  repetitions: number;
  easeFactor: number;
};
