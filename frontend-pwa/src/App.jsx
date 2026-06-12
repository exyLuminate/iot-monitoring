import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Moon, Volume2, VolumeX, Wifi, WifiOff, CheckCircle2, AlertTriangle, Activity, ChevronDown } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [filterCount, setFilterCount] = useState(50);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sensor');
      const sensorLogs = response.data.data;

      if (sensorLogs.length > 0) {
        const reversedData = [...sensorLogs].reverse();
        setData(reversedData);
        setLatestData(sensorLogs[0]);

        const lastUpdate = new Date(sensorLogs[0].created_at).getTime();
        const now = new Date().getTime();
        setIsOnline(now - lastUpdate < 120000);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setIsOnline(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  const displayedData = data.slice(-filterCount);

  const isDark = latestData?.light_level >= 210;
  const isNoisy = latestData?.sound_level === 1;
  const isSafe = latestData?.environment_status === 'Kondusif';

  const chartAxisColor = darkMode ? '#8b949e' : '#64748b';
  const chartGridColor = darkMode ? '#30363d' : '#e2e8f0';
  const tooltipBg = darkMode ? '#161b22' : '#ffffff';
  const tooltipBorder = darkMode ? '#30363d' : '#e2e8f0';
  const tooltipText = darkMode ? '#c9d1d9' : '#1e293b';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0d1117] p-3 sm:p-6 md:p-8 font-sans text-slate-800 dark:text-[#c9d1d9] transition-colors duration-300">
      
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header - Disempurnakan untuk Mobile */}
        <header className="flex flex-col sm:flex-row items-center sm:justify-between bg-white dark:bg-[#161b22] px-5 py-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-[#30363d] transition-colors duration-300 gap-4 sm:gap-0">
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-start">
            <div className="bg-blue-600 dark:bg-blue-500 p-2.5 rounded-xl text-white shadow-md shadow-blue-600/20 shrink-0">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight dark:text-white">Monitor Kelas</h1>
              <p className="text-xs font-medium text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">Live Environment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-slate-100 dark:border-[#30363d] pt-4 sm:pt-0">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-[#21262d] text-slate-600 dark:text-[#c9d1d9] hover:bg-slate-200 dark:hover:bg-[#30363d] transition-colors border border-transparent dark:border-[#30363d]"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isOnline ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400'}`}>
              {isOnline ? <Wifi size={14} strokeWidth={3} /> : <WifiOff size={14} strokeWidth={3} />}
              <span className="text-xs font-bold tracking-wide">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>

        </header>

        {latestData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              
              <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-[#30363d] relative overflow-hidden group transition-colors duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 transition-opacity group-hover:opacity-20 text-slate-800 dark:text-white">
                  {isDark ? <Moon size={80} /> : <Sun size={80} />}
                </div>
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${isDark ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400'}`}>
                    {isDark ? <Moon size={24} /> : <Sun size={24} />}
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-[#8b949e]">Cahaya (LDR)</p>
                  <h2 className="text-4xl font-black mt-1 mb-1 dark:text-white">{latestData.light_level}</h2>
                  <p className="text-xs font-medium text-slate-400 dark:text-[#8b949e]">{isDark ? 'Mode Gelap Aktif' : 'Pencahayaan Terang'}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#161b22] p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-[#30363d] relative overflow-hidden group transition-colors duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 transition-opacity group-hover:opacity-20 text-slate-800 dark:text-white">
                  {isNoisy ? <Volume2 size={80} /> : <VolumeX size={80} />}
                </div>
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${isNoisy ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                    {isNoisy ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-[#8b949e]">Sensor Suara</p>
                  <h2 className="text-2xl font-bold mt-2 mb-2 dark:text-white">{isNoisy ? 'Bising' : 'Tenang'}</h2>
                  <p className="text-xs font-medium text-slate-400 dark:text-[#8b949e]">Ambang Batas Digital</p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl shadow-sm border relative overflow-hidden group transition-colors duration-300 ${isSafe ? 'bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600/90 dark:to-green-800 border-green-600 dark:border-green-500 text-white' : 'bg-gradient-to-br from-rose-500 to-red-600 dark:from-rose-600/90 dark:to-red-800 border-red-600 dark:border-red-500 text-white'}`}>
                 <div className="absolute top-0 right-0 p-6 opacity-20">
                  {isSafe ? <CheckCircle2 size={80} /> : <AlertTriangle size={80} />}
                </div>
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-xl mb-4 bg-white/20 backdrop-blur-sm text-white">
                    {isSafe ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <p className="text-sm font-medium text-white/80">Status Lingkungan</p>
                  <h2 className="text-2xl font-bold mt-2 mb-2">{latestData.environment_status}</h2>
                  <p className="text-xs font-medium text-white/80">Berdasarkan kalkulasi sensor</p>
                </div>
              </div>

            </div>

            <div className="bg-white dark:bg-[#161b22] p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-[#30363d] transition-colors duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <div>
                  <h2 className="text-lg font-bold dark:text-white">Analitik Data</h2>
                  <p className="text-sm text-slate-500 dark:text-[#8b949e]">Visualisasi data secara real-time</p>
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <select 
                    className="w-full sm:w-auto appearance-none bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm font-medium"
                    value={filterCount}
                    onChange={(e) => setFilterCount(Number(e.target.value))}
                  >
                    <option value={10}>10 Entri Terakhir</option>
                    <option value={30}>30 Entri Terakhir</option>
                    <option value={50}>50 Entri Terakhir</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8b949e] pointer-events-none" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="w-full">
                  <div className="h-60 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayedData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                        <XAxis 
                          dataKey="created_at" 
                          tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          tick={{ fontSize: 11, fill: chartAxisColor }} axisLine={false} tickLine={false} dy={10} minTickGap={20}
                        />
                        <YAxis tick={{ fontSize: 11, fill: chartAxisColor }} axisLine={false} tickLine={false} dx={-10} domain={['auto', 'auto']} width={40} />
                        <Tooltip 
                          labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                          contentStyle={{ backgroundColor: tooltipBg, color: tooltipText, borderRadius: '12px', borderColor: tooltipBorder, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="light_level" name="Intensitas Cahaya" stroke={darkMode ? "#58a6ff" : "#4f46e5"} strokeWidth={3} dot={false} activeDot={{ r: 6, fill: darkMode ? '#58a6ff' : '#4f46e5', stroke: tooltipBg, strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="w-full">
                  <div className="h-60 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={displayedData}>
                        <defs>
                          <linearGradient id="colorSound" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={darkMode ? "#3fb950" : "#0ea5e9"} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={darkMode ? "#3fb950" : "#0ea5e9"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                        <XAxis 
                          dataKey="created_at" 
                          tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          tick={{ fontSize: 11, fill: chartAxisColor }} axisLine={false} tickLine={false} dy={10} minTickGap={20}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: chartAxisColor }} axisLine={false} tickLine={false} dx={-10} width={40}
                          ticks={[0, 1]} tickFormatter={(val) => val === 1 ? 'Bising' : 'Aman'}
                        />
                        <Tooltip 
                          labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                          formatter={(value) => [value === 1 ? 'Bising (1)' : 'Aman (0)', 'Deteksi Suara']}
                          contentStyle={{ backgroundColor: tooltipBg, color: tooltipText, borderRadius: '12px', borderColor: tooltipBorder, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="stepAfter" dataKey="sound_level" name="Deteksi Suara" stroke={darkMode ? "#3fb950" : "#0ea5e9"} strokeWidth={2} fillOpacity={1} fill="url(#colorSound)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#161b22] rounded-2xl shadow-sm border border-slate-200/60 dark:border-[#30363d] min-h-[400px] transition-colors duration-300">
             <Activity size={48} className="text-slate-300 dark:text-[#30363d] animate-pulse mb-4" />
             <p className="text-slate-500 dark:text-[#8b949e] font-medium">Menghubungkan ke sensor...</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;