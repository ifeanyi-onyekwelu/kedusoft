from app import create_app
from app.models import db
from .app.utils.variables import PORT

app, socketio = create_app()


@app.shell_context_processor
def make_shell_context():
    return {"db": db, "app": app, "socketio": socketio}


if __name__ == "__main__":
    port = int(PORT)
    socketio.run(app, host="0.0.0.0", port=port)
