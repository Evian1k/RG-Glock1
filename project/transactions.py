# Transaction management

class Transaction:
    def __init__(self, tx_id, user_id, amount, tx_type):
        self.tx_id = tx_id
        self.user_id = user_id
        self.amount = amount
        self.tx_type = tx_type

    def to_dict(self):
        return {
            "tx_id": self.tx_id,
            "user_id": self.user_id,
            "amount": self.amount,
            "tx_type": self.tx_type
        }


def create_transaction(user_id, amount, tx_type):
    from uuid import uuid4
    return Transaction(str(uuid4()), user_id, amount, tx_type)
