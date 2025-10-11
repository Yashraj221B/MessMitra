-- Add meal_type and date to feedbacks table for food ratings
ALTER TABLE feedbacks ADD COLUMN meal_type meal_type;
ALTER TABLE feedbacks ADD COLUMN meal_date DATE;

-- Add index for better query performance
CREATE INDEX idx_feedback_meal_date ON feedbacks(meal_date);
CREATE INDEX idx_feedback_mess_meal_date ON feedbacks(mess_id, meal_date);
