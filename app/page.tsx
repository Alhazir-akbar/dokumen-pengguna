import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndWorkspace() {
      // 1. Periksa apakah JWT Token ada di penyimpanan lokal
      const token = localStorage.getItem('token');
      
      if (!token) {
        // 2. Jika tidak ada token, arahkan paksa ke halaman login
        router.replace('/login');
        return;
      }

      try {
        // 3. Jika ada token, cek apakah user sudah memiliki workspace/tim
        const response = await fetch('http://localhost:8000/api/workspaces', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token tidak valid atau kedaluwarsa
          localStorage.removeItem('token');
          router.replace('/login');
          return;
        }

        const workspaces = await response.json();

        // 4. Periksa ketersediaan tim/workspace
        if (!workspaces || workspaces.length === 0) {
          // Belum punya tim -> arahkan ke halaman pembuatan tim/workspace
          router.replace('/team/create'); // Sesuaikan dengan route halaman buat tim kamu
        } else {
          // Sudah punya tim -> arahkan ke setup proyek
          router.replace('/project-setup');
        }
      } catch (error) {
        console.error('Gagal memeriksa status workspace:', error);
        router.replace('/login');
      }
    }

    checkAuthAndWorkspace();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="text-center">
        {/* Spinner loading sederhana */}
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="temp-loading text-sm text-gray-500 font-medium animate-pulse">
          Memeriksa status masuk dan ruang kerja...
        </p>
      </div>
    </div>
  );
}
