from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '123123'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
    return jsonify({'token': access_token, 'user': {'id': user.id, 'username': user.username}})



@app.route('/user/me', methods=['GET'])
@jwt_required()
def get_user_info():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username
    })

@app.route('/tasks', methods=['GET', 'POST'])
@jwt_required()
def manage_tasks():
    user_id = get_jwt_identity()

    if request.method == 'GET':
        tasks = Task.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'status': task.status
        } for task in tasks])

    if request.method == 'POST':
        data = request.get_json()
        new_task = Task(
            title=data['title'],
            description=data.get('description'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
            status=data['status'],
            user_id=user_id
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'due_date': new_task.due_date.isoformat() if new_task.due_date else None,
            'status': new_task.status
        }), 201

@app.route('/tasks/<int:task_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def handle_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

    if request.method == 'GET':
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'status': task.status
        })

    if request.method == 'PUT':
        data = request.get_json()
        task.title = data['title']
        task.description = data.get('description')
        task.due_date = datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
        task.status = data['status']
        db.session.commit()
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date.isoformat() if task.due_date else None,
            'status': task.status
        })

    if request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return '', 204

if __name__ == '__main__':
    app.run(debug=True)
