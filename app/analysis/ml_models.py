from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import numpy as np
import joblib
from typing import Dict, Tuple

class SignalMLModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100)
        self.scaler = StandardScaler()
        self.trained = False

    def prepare_features(self, indicators: Dict) -> np.ndarray:
        rsi_val = 50.0
        if 'rsi' in indicators and len(indicators['rsi']) > 0:
            rsi_val = float(indicators['rsi'].iloc[-1])
        
        macd_val = 0.0
        if 'macd' in indicators and 'MACD_12_26_9' in indicators['macd'].columns:
            macd_val = float(indicators['macd']['MACD_12_26_9'].iloc[-1])
        
        features = np.array([
            rsi_val,
            macd_val,
            # Add more features as needed
        ])
        return features.reshape(1, -1)

    def fit(self, X: np.ndarray, y: np.ndarray):
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.trained = True
        joblib.dump(self.model, 'rf_model.pkl')
        joblib.dump(self.scaler, 'scaler.pkl')

    def predict(self, features: np.ndarray) -> Tuple[float, str]:
        if not self.trained:
            return 0.5, 'hold'
        X_scaled = self.scaler.transform(features)
        prob = self.model.predict_proba(X_scaled)[0][1]  # buy prob
        action = 'buy' if prob > 0.6 else 'sell' if prob < 0.4 else 'hold'
        return prob, action

