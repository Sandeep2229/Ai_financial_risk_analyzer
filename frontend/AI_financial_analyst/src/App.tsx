import React, { useState } from 'react';
import { Brain, TrendingUp, Shield, AlertTriangle, CheckCircle2, Loader2, Info, Sparkles } from 'lucide-react';

interface PredictionResult {
  prediction: number;
  default_probability: number;
}

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const parseFeatures = (inputText: string): number[] | null => {
    try {
      const trimmed = inputText.trim();
      if (!trimmed) return null;
      
      const numbers = trimmed.split(',').map(item => {
        const num = parseFloat(item.trim());
        if (isNaN(num)) throw new Error(`Invalid number: ${item.trim()}`);
        return num;
      });
      
      if (numbers.length !== 46) {
        throw new Error(`Expected 46 features, but got ${numbers.length}`);
      }
      
      return numbers;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Invalid input format');
    }
  };

  const handlePredict = async () => {
    setError(null);
    setResult(null);
    
    try {
      const features = parseFeatures(input);
      if (!features) {
        setError('Please enter exactly 46 comma-separated numbers');
        return;
      }
      
      setLoading(true);
      
      const response = await fetch('https://ai-financial-risk-analyzer.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePredict();
  };

  const getRiskLevel = (probability: number) => {
    if (probability < 0.3) return { level: 'Low', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    if (probability < 0.7) return { level: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 min-h-screen backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
              AI Financial Analyst
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Predict loan default risk instantly using advanced machine learning algorithms
            </p>
            
            <div className="flex justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>99.2% Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 md:p-12">
              
              {/* Feature Input Section */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <label htmlFor="features" className="text-2xl font-semibold text-white">
                      Financial Features Input
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      {showTooltip && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap border border-slate-600 z-20">
                          Enter 46 numerical features representing financial metrics
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-slate-400 mb-6">
                    Paste 46 numeric features (comma-separated) representing borrower financial data
                  </p>
                  
                  <div className="relative">
                    <textarea
                      id="features"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="0.5, 1.2, -0.8, 2.1, 0.0, 1.5, -1.2, 0.9, 1.8, 0.3, -0.5, 1.1, 0.7, -0.2, 1.4, 0.6, -0.9, 1.3, 0.8, -0.1, 1.0, 0.4, -0.7, 1.6, 0.2, -0.3, 1.9, 0.1, -0.6, 1.7, 0.9, -0.4, 1.2, 0.5, -0.8, 1.8, 0.3, -0.2, 1.4, 0.7, -0.5, 1.1, 0.6, -0.9, 1.5, 0.8"
                      className="w-full h-40 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
                      disabled={loading}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                      {input.split(',').filter(x => x.trim()).length}/46 features
                    </div>
                  </div>
                </div>

                {/* Predict Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:scale-100 disabled:shadow-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Analyzing Risk...
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">🔮</span>
                          Predict Risk
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {/* Results Section */}
              {(result || error) && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  {error && (
                    <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 mb-6">
                      <div className="flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-red-300 text-lg mb-2">Analysis Error</h3>
                          <p className="text-red-200">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="space-y-6">
                      {/* Success Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        <h3 className="text-2xl font-bold text-white">Risk Analysis Complete</h3>
                      </div>
                      
                      {/* Results Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Prediction Result */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                          <div className="text-slate-400 text-sm font-medium mb-2">PREDICTION</div>
                          <div className="text-3xl font-bold mb-2">
                            {result.prediction === 1 ? (
                              <span className="text-red-400">Default Risk</span>
                            ) : (
                              <span className="text-emerald-400">Safe Loan</span>
                            )}
                          </div>
                          <div className="text-slate-300">
                            Classification: {result.prediction === 1 ? 'High Risk (1)' : 'Low Risk (0)'}
                          </div>
                        </div>
                        
                        {/* Probability */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                          <div className="text-slate-400 text-sm font-medium mb-2">DEFAULT PROBABILITY</div>
                          <div className="text-3xl font-bold text-white mb-2">
                            {(result.default_probability * 100).toFixed(1)}%
                          </div>
                          <div className={`text-sm font-medium ${getRiskLevel(result.default_probability).color}`}>
                            {getRiskLevel(result.default_probability).level} Risk Level
                          </div>
                        </div>
                      </div>
                      
                      {/* Risk Visualization */}
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="text-slate-400 text-sm font-medium mb-4">RISK ASSESSMENT</div>
                        <div className="relative">
                          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                result.default_probability > 0.7 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                result.default_probability > 0.3 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              }`}
                              style={{ width: `${result.default_probability * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        <div className="mt-4 text-slate-300 text-sm">
                          {result.default_probability > 0.7 
                            ? '⚠️ High probability of default - recommend loan rejection or additional collateral' 
                            : result.default_probability > 0.3
                            ? '⚡ Moderate risk - consider additional verification or adjusted terms'
                            : '✅ Low default risk - loan approval recommended'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-slate-400">
            <p className="text-sm">
              Ensure your ML API server is running on <code className="bg-white/10 px-2 py-1 rounded text-cyan-400">https://ai-financial-risk-analyzer.onrender.com</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;