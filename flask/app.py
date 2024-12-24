from flask import Flask, request, jsonify, Response, make_response
import cv2
import mediapipe as mp
import numpy as np
import time
from typing import List, Dict, Tuple, Optional
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app, resources={r"/*": {"origins": "*"}})

# MediaPipe configuration
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Global state
counter = 0
stage = None
cap = None
running = False

class ExerciseState:
    def __init__(self):
        self.counter = 0
        self.stage = None
        self.last_rep_time = time.time()
        self.feedback_timer = time.time()
        self.feedback_message = ""
        self.feedback_color = (255, 255, 255)

# Initialize exercise states
exercise_states = {
    'left_bicep_curl': ExerciseState(),
    'right_bicep_curl': ExerciseState(),
    'squat': ExerciseState(),
    'shoulder_press': ExerciseState(),
    'push_up':ExerciseState(),
    'side_plank':ExerciseState(),
    'deadlift':ExerciseState(),
    'plank':ExerciseState(),
    'lunge':ExerciseState()

}

def calculateAngle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle

def generate_frames(exercise_type):
    global cap, running
    exercise_state = exercise_states[exercise_type]
    
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap and cap.isOpened() and running:
            ret, frame = cap.read()
            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = pose.process(image)
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            if results.pose_landmarks:
                try:
                    landmarks = results.pose_landmarks.landmark
                    if exercise_type == 'left_bicep_curl':
                        image = handle_left_bicep_curl(landmarks, image, exercise_state, results)
                    elif exercise_type == 'right_bicep_curl':
                        image = handle_right_bicep_curl(landmarks, image, exercise_state, results)
                    elif exercise_type == 'squat':
                        image = handle_squat(landmarks, image, exercise_state, results)
                    elif exercise_type == 'shoulder_press':
                        image = handle_shoulder_press(landmarks, image, exercise_state, results)
                    elif exercise_type=='lunge':
                        image=  handle_lunge(landmarks, image, exercise_state, results)
                    elif exercise_type=='deadlift':
                        image=  handle_deadlift(landmarks, image, exercise_state, results)
                    elif exercise_type=='push_up':
                        image=  handle_push_up(landmarks, image, exercise_state, results)
                    elif exercise_type=='side_plank':
                        image=  handle_side_plank(landmarks, image, exercise_state, results)
                    elif exercise_type=='plank':
                        image=  handle_plank(landmarks, image, exercise_state, results)
                except Exception as e:
                    print(f"Error processing {exercise_type}: {e}")

            _, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
def handle_push_up(landmarks, image, state, results):
    print("hello");
    # Extract key coordinates
    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]

    # Calculate angles
    arm_angle = calculateAngle(shoulder, elbow, wrist)
    body_angle = calculateAngle(shoulder, hip, [hip[0], hip[1] + 0.1])

    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form feedback
    if body_angle < 150:
        feedback_message = "Keep your body straight!"
        feedback_color = (0, 0, 255)

    # Counter logic
    if arm_angle > 160:
        state.stage = "up"
    elif arm_angle < 70 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        feedback_message = f"Rep {state.counter} complete!"
        feedback_color = (0, 255, 0)

    # Display UI elements
    cv2.putText(image, f"Angle: {int(arm_angle)}", 
                tuple(np.multiply(elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    if feedback_message:
        cv2.putText(image, feedback_message, (10, 110), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, feedback_color, 2, cv2.LINE_AA)

    return image
def handle_lunge(landmarks, image, state, results):
    # Extract key coordinates
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

    # Calculate angles
    knee_angle = calculateAngle(hip, knee, ankle)

    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form feedback
    if knee_angle < 90:
        feedback_message = "Lower your body more!"
        feedback_color = (0, 0, 255)

    # Counter logic
    if knee_angle > 160:
        state.stage = "up"
    elif knee_angle < 90 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        feedback_message = f"Rep {state.counter} complete!"
        feedback_color = (0, 255, 0)

    return image
def handle_plank(landmarks, image, state, results):
    # Extract key coordinates
    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

    # Calculate angle
    body_angle = calculateAngle(shoulder, hip, ankle)

    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form feedback
    if body_angle < 150 or body_angle > 180:
        feedback_message = "Keep your body straight!"
        feedback_color = (0, 0, 255)

    return image
def handle_deadlift(landmarks, image, state, results):
    # Extract key coordinates
    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]

    # Calculate angles
    back_angle = calculateAngle(shoulder, hip, knee)

    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form feedback
    if back_angle < 120:
        feedback_message = "Keep your back straight!"
        feedback_color = (0, 0, 255)

    # Counter logic
    if back_angle > 150:
        state.stage = "up"
    elif back_angle < 90 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        feedback_message = f"Rep {state.counter} complete!"
        feedback_color = (0, 255, 0)

    return image
def handle_side_plank(landmarks, image, state, results):
    # Extract key coordinates
    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

    # Calculate angle
    body_angle = calculateAngle(shoulder, hip, ankle)

    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form feedback
    if body_angle < 160:
        feedback_message = "Keep your hips up!"
        feedback_color = (0, 0, 255)
    else:
        feedback_message = "Great form!"
        feedback_color = (0, 255, 0)

    # Update the state (if needed, for tracking reps or time held)
    if state.stage == "down" and body_angle >= 160:
        state.stage = "up"
        state.counter += 1
    elif body_angle < 160:
        state.stage = "down"

    # Display feedback on the image
    cv2.putText(image, f"Angle: {int(body_angle)}",
                tuple(np.multiply(hip, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.putText(image, feedback_message,
                (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, feedback_color, 2, cv2.LINE_AA)

    # Display counter and stage
    cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)
    cv2.putText(image, 'REPS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, str(state.counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(image, 'STAGE', (65, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, state.stage, (60, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

    # Draw landmarks
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    return image


def handle_right_bicep_curl(landmarks, image, state, results):
    # Extract coordinates
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]

    # Calculate angles
    arm_angle = calculateAngle(shoulder, elbow, wrist)
    body_angle = calculateAngle([0, shoulder[1]], shoulder, hip)
    wrist_angle = calculateAngle(elbow, wrist, [wrist[0], wrist[1] + 0.1])

    current_time = time.time()
    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form checking
    if body_angle < 80 or body_angle > 100:
        feedback_message = "Keep your back straight!"
        feedback_color = (0, 0, 255)
    elif wrist_angle < 150:
        feedback_message = "Keep your wrist straight!"
        feedback_color = (0, 0, 255)
    elif abs(shoulder[0] - elbow[0]) > 0.1:
        feedback_message = "Keep elbow close to body!"
        feedback_color = (0, 0, 255)

    # Counter logic
    if arm_angle > 160:
        state.stage = "down"
    elif arm_angle < 30 and state.stage == 'down':
        state.stage = "up"
        state.counter += 1
        state.last_rep_time = current_time
        feedback_message = f"Rep {state.counter} complete!"
        feedback_color = (0, 255, 0)

    # Display UI elements
    cv2.putText(image, f"Angle: {int(arm_angle)}", 
                tuple(np.multiply(elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)
    cv2.putText(image, 'REPS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, str(state.counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(image, 'STAGE', (65, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, state.stage or "", (60, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

    if feedback_message:
        cv2.rectangle(image, (0, 80), (640, 120), (0, 0, 0), -1)
        cv2.putText(image, feedback_message, (10, 110), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, feedback_color, 2, cv2.LINE_AA)

    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    return image
def handle_shoulder_press(landmarks, image, state, results):
    # Extract coordinates for left and right sides
    left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, 
                     landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, 
                  landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
    left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, 
                  landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

    right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, 
                      landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, 
                   landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, 
                   landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

    # Calculate angles for both arms
    left_arm_angle = calculateAngle(left_shoulder, left_elbow, left_wrist)
    right_arm_angle = calculateAngle(right_shoulder, right_elbow, right_wrist)

    current_time = time.time()
    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form feedback
    if left_arm_angle < 160 or right_arm_angle < 160:
        feedback_message = "Fully extend your arms!"
        feedback_color = (0, 0, 255)
    elif left_wrist[1] > left_elbow[1] or right_wrist[1] > right_elbow[1]:
        feedback_message = "Keep your wrists above elbows!"
        feedback_color = (0, 0, 255)

    # Counter logic
    if left_arm_angle > 160 and right_arm_angle > 160:
        state.stage = "up"
    elif left_arm_angle < 90 and right_arm_angle < 90 and state.stage == "up":
        state.stage = "down"
        state.counter += 1
        state.last_rep_time = current_time
        feedback_message = f"Rep {state.counter} complete!"
        feedback_color = (0, 255, 0)

    # Display UI elements
    cv2.putText(image, f"Left Angle: {int(left_arm_angle)}", 
                tuple(np.multiply(left_elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.putText(image, f"Right Angle: {int(right_arm_angle)}", 
                tuple(np.multiply(right_elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)
    cv2.putText(image, 'REPS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, str(state.counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(image, 'STAGE', (65, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, state.stage or "", (60, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

    if feedback_message:
        cv2.rectangle(image, (0, 80), (640, 120), (0, 0, 0), -1)
        cv2.putText(image, feedback_message, (10, 110), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, feedback_color, 2, cv2.LINE_AA)

    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    return image

def handle_left_bicep_curl(landmarks, image, state, results):
    # Extract coordinates
    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]

    # Calculate angles
    arm_angle = calculateAngle(shoulder, elbow, wrist)
    body_angle = calculateAngle([0, shoulder[1]], shoulder, hip)
    wrist_angle = calculateAngle(elbow, wrist, [wrist[0], wrist[1] + 0.1])

    current_time = time.time()
    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form checking
    if body_angle < 80 or body_angle > 100:
        feedback_message = "Keep your back straight!"
        feedback_color = (0, 0, 255)
    elif wrist_angle < 150:
        feedback_message = "Keep your wrist straight!"
        feedback_color = (0, 0, 255)
    elif abs(shoulder[0] - elbow[0]) > 0.1:
        feedback_message = "Keep elbow close to body!"
        feedback_color = (0, 0, 255)

    # Counter logic
    if arm_angle > 160:
        state.stage = "down"
    elif arm_angle < 30 and state.stage == 'down':
        state.stage = "up"
        state.counter += 1
        state.last_rep_time = current_time
        feedback_message = f"Rep {state.counter} complete!"
        feedback_color = (0, 255, 0)

    # Display UI elements
    cv2.putText(image, f"Angle: {int(arm_angle)}", 
                tuple(np.multiply(elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)
    cv2.putText(image, 'REPS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, str(state.counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(image, 'STAGE', (65, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, state.stage or "", (60, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

    if feedback_message:
        cv2.rectangle(image, (0, 80), (640, 120), (0, 0, 0), -1)
        cv2.putText(image, feedback_message, (10, 110), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, feedback_color, 2, cv2.LINE_AA)

    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    return image

# Similar corrections for handle_right_bicep_curl, handle_squat, and handle_shoulder_press functions...
# [Additional exercise handler functions would go here with similar corrections]
def handle_squat(landmarks, image, state, results):
    # Extract coordinates
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

    # Calculate angles
    knee_angle = calculateAngle(hip, knee, ankle)
    back_angle = calculateAngle([hip[0], 0], hip, knee)

    current_time = time.time()
    feedback_message = ""
    feedback_color = (255, 255, 255)

    # Form checking
    if back_angle < 70 or back_angle > 110:
        feedback_message = "Keep your back upright!"
        feedback_color = (0, 0, 255)
    elif knee_angle < 90:
        feedback_message = "Don't squat too deep!"
        feedback_color = (0, 0, 255)
    elif knee_angle > 160:
        feedback_message = "Go lower for better form!"
        feedback_color = (0, 0, 255)

    # Counter logic
    if knee_angle > 160:
        state.stage = "up"
    elif knee_angle < 90 and state.stage == 'up':
        state.stage = "down"
        state.counter += 1
        state.last_rep_time = current_time
        feedback_message = f"Rep {state.counter} complete!"
        feedback_color = (0, 255, 0)

    # Display UI elements
    cv2.putText(image, f"Knee Angle: {int(knee_angle)}", 
                tuple(np.multiply(knee, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)
    cv2.putText(image, 'REPS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, str(state.counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(image, 'STAGE', (65, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, state.stage or "", (60, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

    if feedback_message:
        cv2.rectangle(image, (0, 80), (640, 120), (0, 0, 0), -1)
        cv2.putText(image, feedback_message, (10, 110), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, feedback_color, 2, cv2.LINE_AA)

    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    return image

@app.route("/start_camera", methods=["POST", "GET", "OPTIONS"])
def start_camera():
    global running, cap
    
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        return response
        
    try:
        if cap is None or not cap.isOpened():
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                return jsonify({"error": "Failed to access camera"}), 500
        
        running = True
        # Reset all exercise states
        for state in exercise_states.values():
            state.counter = 0
            state.stage = None
            
        return jsonify({"message": "Camera started successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stop_camera', methods=['POST'])
def stop_camera():
    global running, cap
    running = False
    if cap:
        cap.release()
        cap = None
    return jsonify({"message": "Camera stopped"}), 200

@app.route('/reset_counter', methods=['POST'])
def reset_counter():
    for state in exercise_states.values():
        state.counter = 0
        state.stage = None
    return jsonify({"message": "Counters reset"}), 200

# Exercise routes
@app.route('/<exercise_type>', methods=['GET'])
def exercise_stream(exercise_type):
    if exercise_type not in exercise_states:
        return "Invalid exercise type", 400
    if not running:
        return "Camera not running", 503
    return Response(
        generate_frames(exercise_type),
        mimetype='multipart/x-mixed-replace; boundary=frame',
        headers={'Cache-Control': 'no-store, must-revalidate'}
    )

if __name__ == '__main__':
    app.run(debug=True, port=8000)


