from app import create_app
from app.models import db

app, socketio = create_app()


@app.shell_context_processor
def make_shell_context():
    return {"db": db, "app": app, "socketio": socketio}


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
