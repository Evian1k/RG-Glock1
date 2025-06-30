# Simulation functions

import random

def simulate_marketplace_activity(num_users=100):
    """Simulate marketplace activity and return summary."""
    transactions = [random.randint(1, 100) for _ in range(num_users)]
    return {
        "total_transactions": sum(transactions),
        "average_transaction": sum(transactions) / num_users if num_users else 0,
        "max_transaction": max(transactions) if transactions else 0
    }
