# Integrity monitoring

Recorded signals include face present/missing/multiple faces where the browser supports `FaceDetector`, camera stopped, tab hidden, window blur, fullscreen exit, connection interruption, and permission/device failure states.

Events contain type, severity, timestamp, and small structured metadata. They do not contain images or recordings. Browser support varies, so missing face events are not inferred on unsupported browsers.

Signals are contextual evidence for a human reviewer. A single event—or any automated combination—is not proof of cheating and does not make an employment decision.
