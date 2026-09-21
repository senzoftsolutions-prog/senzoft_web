# AI interview database

`Interview` now stores configuration, expiry, and final result. `InterviewQuestion` stores ordered bounded questions. `InterviewResponse` links one-to-one to a question and stores transcript, provider evaluation, competency signals, and score. `IntegrityEvent` stores typed timestamped browser signals. `InterviewEvaluation` stores the final structured scoring summary.

The `(interview, sequence)` question constraint and one-to-one response link prevent duplicate sequence/response records. Foreign keys retain the existing application, candidate, and job ownership chain.

No audio, video, camera frame, or screen recording column exists.
