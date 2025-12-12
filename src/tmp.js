const BUILD_CHECK = "${buildCheck}";
fetch('./check.json', { cache: 'no-store' })
  .then(res => res.json())
  .then(data => {
    if (data.check && data.check === BUILD_CHECK) {
      return
    }
    // Event de retour pour reload
    window.addEventListener('message', (event) => {
      if (event.origin && (event.data.name !== 'PwaReloadToSkeletor' || event.data.trigger !== 'reload' || event.data.contextPath !== '${options.contextPath}')) {
        return
      }
      location.reload(true);
    })
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Reloading')
      window.location.reload()
    },
      { once: true }
    )
    // Récup du SW to unregister
    navigator.serviceWorker.getRegistrations().then(
      (registrations) => {
        const ws = registrations.map(r => {
          if (!r.scope.includes('${options.contextPath}/')) {
            return null
          }
          // Sending msg popur display wait box
          // window.parent.postMessage({ name: 'PwaReloadToSkeletor', trigger: 'failCheck', contextPath: '${options.contextPath}'})
          return r.update()
        })
        // 4. Écouter le changement de contrôleur
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Reloading')
          window.location.reload(); // Recharge la page quand le nouveau SW est actif
        });
        return Promise.all(ws.filter(el => el != null))
      },
      (err) => {
        throw err
      }
    )
      .then((resp) => {
        // forcer l'activation si une version est déjà prête
        navigator.serviceWorker.getRegistration(scopeNeedle).then((reg) => {
          if (reg && reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' })
          }
        })
        console.log('Reloading done')
      }, (err) => {
        console.error('Reloading error', error)
      })
  })
  .catch(console.error);