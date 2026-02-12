from flask import Flask
from routes.register import register_bp
from routes.face_enroll import face_enroll_bp
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}},supports_credentials=True)

app.register_blueprint(register_bp, url_prefix="/api")
app.register_blueprint(face_enroll_bp, url_prefix="/api")

from routes.face_verify import face_verify_bp

app.register_blueprint(face_verify_bp, url_prefix="/api")
from routes.verify_context import verify_context_bp
app.register_blueprint(verify_context_bp)

if __name__ == "__main__":
    app.run(debug=True, port=4000)
