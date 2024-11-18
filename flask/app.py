from flask import Flask, request, jsonify, Response,make_response
import cv2
import mediapipe as mp
import numpy as np
import time
from typing import List, Dict, Tuple, Optional
from flask_cors import CORS

# Enable CORS for your app


app = Flask(__name__)
app.secret_key = 'your_secret_key'
# CORS(app, resources={r"/api/": {"origins": "http://localhost:5173"}})
# CORS(app, resources={r"/api/": {"origins": "*"}})
# # cors=CORS(app,resources={r"/api/*":{'origins':'http://localhost:5173'}})
# CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})
CORS(app, resources={r"/*": {"origins": "*"}})

# MediaPipe configuration
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
counter=0
stage=None
cap=None
running=False


def calculateAngle(a, b, c):
    # Calculate the angle between three points
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle


def generate_frames(exercise_type):
    global cap, running, counter, stage
    running = True
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = pose.process(image)
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                landmarks = results.pose_landmarks.landmark
                if exercise_type == 'left_bicep_curl':
                    handle_left_bicep_curl(landmarks, image)
                elif exercise_type == 'right_bicep_curl':
                    handle_right_bicep_curl(landmarks, image)
                elif exercise_type == 'squat':
                    handle_squat(landmarks, image)
                elif exercise_type == 'shoulder_press':
                    handle_shoulder_press(landmarks, image)
                # Add more exercises here...

            except Exception as e:
                print(e)

            # Encode the frame in JPEG format
            _, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        cap.release()

def handle_left_bicep_curl(landmarks, image):
    global counter, stage
    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
    angle = calculateAngle(shoulder, elbow, wrist)

    # Display the angle on the video feed
    cv2.putText(image, str(angle), tuple(np.multiply(elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    # Curl counter logic for left bicep curl
    if angle > 160:
        stage = "down"
    if angle < 30 and stage == 'down':
        stage = "up"
        counter += 1

    # Status box for curl counter
    cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)
    cv2.putText(image, 'REPS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, str(counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(image, 'STAGE', (65, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(image, stage, (60, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

    mp_drawing.draw_landmarks(image, landmarks, mp_pose.POSE_CONNECTIONS,
                              mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                              mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2))


def handle_shoulder_press(landmarks, image):
    global counter, stage

    # Get coordinates for the left and right shoulder, elbow, and wrist
    left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
    left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
    
    right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
    
    # Calculate angles for both arms
    left_arm_angle = calculateAngle(left_shoulder, left_elbow, left_wrist)
    right_arm_angle = calculateAngle(right_shoulder, right_elbow, right_wrist)
    
    # Display the angles on the video feed
    cv2.putText(image, f'Left: {int(left_arm_angle)}', tuple(np.multiply(left_elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(image, f'Right: {int(right_arm_angle)}', tuple(np.multiply(right_elbow, [640, 480]).astype(int)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

    # Determine correctness (if arms are close to vertical when raised)
    correct_left_arm = 160 <= left_arm_angle <= 180  # 160-180 degrees is considered vertical
    correct_right_arm = 160 <= right_arm_angle <= 180

    # Check if the stage is "down" (arms lower than a certain threshold)
    if left_arm_angle < 30 and right_arm_angle < 30:
        stage = "down"
    # Check if the stage is "up" (arms raised correctly)
    if correct_left_arm and correct_right_arm and stage == "down":
        stage = "up"
        counter += 1

    # Set feedback color
    feedback_color = (0, 255, 0) if correct_left_arm and correct_right_arm else (0, 0, 255)  # Green for correct, red for incorrect
    
    # # Display counter and stage
    # cv2.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)
    # cv2.putText(image, 'REPS', (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    # cv2.putText(image, str(counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)
    # cv2.putText(image, 'STAGE', (65, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
    # cv2.putText(image, stage, (60, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # Display counter and stage
    # Draw background rectangle
    cv2.rectangle(image, (0, 0), (300, 100), (245, 117, 16), -1)

    # Display 'REPS' label
    cv2.putText(image, 'REPS', (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2, cv2.LINE_AA)

    # Display counter value
    cv2.putText(image, str(counter), (15, 80), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3, cv2.LINE_AA)

    # Display 'STAGE' label
    cv2.putText(image, 'STAGE', (160, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2, cv2.LINE_AA)

    # Display stage value
    cv2.putText(image, stage, (160, 80), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3, cv2.LINE_AA)


    # Check if form is incorrect and display an alert message
    if not (correct_left_arm and correct_right_arm):
        cv2.rectangle(image, (0, 80), (300, 130), (0, 0, 255), -1)  # Red box for alert
        cv2.putText(image, "Improper Form!", (10, 115),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(image, "Correct your posture!", (10, 150),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)

    # Draw landmarks with feedback color for pose correction
    mp_drawing.draw_landmarks(
        image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
        mp_drawing.DrawingSpec(color=feedback_color, thickness=2, circle_radius=2),
        mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
    )


# Define similar functions for other exercises
def handle_right_bicep_curl(landmarks, image):
    # Similar logic for right bicep curl
    pass

def handle_squat(landmarks, image):
    # Logic for squat detection
    pass

@app.route("/start_camera", methods=["POST","GET"])
def start_camera():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5174"
        
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        return response
    elif request.method == "POST":
        
        """Start the camera."""
        global running, cap, exercise_state
        if cap is None or not cap.isOpened():
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                return jsonify({"error": "Camera failed to start"}), 500
        
    counter=0
    stage=None
    running = True
    return jsonify({"message": "Camera started"}), 200

@app.route('/stop_camera', methods=['POST'])
def stop_camera():
    """Stop the camera."""
    global running, cap, exercise_state
    running = False
    if cap is not None and cap.isOpened():
        cap.release()
        cap = None
    counter=0
    stage=None
    return jsonify({"message": "Camera stopped"}), 200

@app.route('/reset_counter', methods=['POST'])
def reset_counter():
    """Reset the exercise counter."""
    global exercise_state
    counter=0
    stage=0
    return jsonify({"message": "Counter reset"}), 200

@app.route('/leftbicep_curl', methods=['GET'])
def left_bicep_curl():
    if running:
        return Response(generate_frames('left_bicep_curl'), mimetype='multipart/x-mixed-replace; boundary=frame', headers={'Cache-Control': 'no-store, must-revalidate'})
    else:
        return "Camera is not running", 503

@app.route('/rightbicep_curl', methods=['GET'])
def right_bicep_curl():
    if running:
        return Response(generate_frames('right_bicep_curl'), mimetype='multipart/x-mixed-replace; boundary=frame', headers={'Cache-Control': 'no-store, must-revalidate'})
    else:
        return "Camera is not running", 503

@app.route('/squat', methods=['GET'])
def squat():
    if running:
        return Response(generate_frames('squat'), mimetype='multipart/x-mixed-replace; boundary=frame', headers={'Cache-Control': 'no-store, must-revalidate'})
    else:
        return "Camera is not running", 503
    
@app.route('/shoulder_press', methods=['GET'])
def shoulder_press():
    if running:
        return Response(generate_frames('shoulder_press'), mimetype='multipart/x-mixed-replace; boundary=frame', headers={'Cache-Control': 'no-store, must-revalidate'})
    else:
        return "Camera is not running", 503

if __name__ == '__main__':
    app.run(debug=True, port=8000)
