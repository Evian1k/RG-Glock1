# Data model example
class User:
    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return f"<User {self.username}>"

class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __repr__(self):
        return f"<Product {self.name}: ${self.price}>"
