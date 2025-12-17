fetch('./check.json', { cache: 'no-store' })
  .then(res => res.json())
  .then(data => {
    const BUILD_CHECK = "${buildCheck}";
    const contextPaths = ${ contextPaths };
    const appNames = ${ appNames };
    if (data.check && data.check === BUILD_CHECK) {
      if (contextPaths.length > 1) {
        window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'checkOthers', contextPath: contextPaths, appName: appNames })
      }
      return
    }
    // Event de retour pour reload
    window.addEventListener('message', (event) => {
      if (event.origin && (event.data.name !== 'PwaReloadToSkeletor' || event.data.trigger !== 'reload')) {
        return
      }
      if (!(contextPaths.length === event.data.contextPath.length && contextPaths.every((val, i) => val === event.data.contextPath[i]))) {
        return
      }
      location.reload(true);
    })
    window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: contextPaths, appName: appNames })
  }).catch(console.error);