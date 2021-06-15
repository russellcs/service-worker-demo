if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").then(
      function(registration) {
        console.log(
          "the installing worker, or undefined",
          registration.installing
        );
        console.log("the waiting worker, or undefined", registration.waiting);
        console.log("the active worker, or undefined", registration.active);
        // Registration was successful
        // registration.update();
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );

        registration.addEventListener("updatefound", () => {
          // A wild service worker has appeared in reg.installing!
          const newWorker = registration.installing;

          console.log("Update Found: New worker state:", newWorker.state);
          // "installing" - the install event has fired, but not yet complete
          // "installed"  - install complete
          // "activating" - the activate event has fired, but not yet complete
          // "activated"  - fully active
          // "redundant"  - discarded. Either failed install, or it's been
          //                replaced by a newer version

          newWorker.addEventListener("statechange", () => {
            // newWorker.state has changed
            console.log(
              "Worker state changed: New worker state:",
              newWorker.state
            );
          });
        });
      },
      function(err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
