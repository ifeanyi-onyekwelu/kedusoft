from app import create_app, socketio
from app.utils.variables import PORT
from app.utils.messaging_socket import init_messaging_socket

app = create_app()

init_messaging_socket(socketio)

if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(PORT),
        debug=True,
        allow_unsafe_werkzeug=True,
    )
