export function downloadProctorInstaller() {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isWindows = navigator.platform.toUpperCase().indexOf('WIN') >= 0;
  
    const baseUrl = `${window.location.origin}/downloads`;
    const fileName = isMac
      ? 'GyapakProctor.dmg'
      : isWindows
      ? 'GyapakProctor-Setup.exe'
      : null;
  
    if (fileName) {
      const link = document.createElement('a');
      link.href = `${baseUrl}/${fileName}`;
      link.download = fileName;
      link.click();
    } else {
      alert('Unsupported platform. Please use Windows or macOS.');
    }
  }
  