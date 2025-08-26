
project_name: "my-looker-project"

application: dashboard-filter-link {
  label: "Dashboard Filter Link"
  url: "https://localhost:8080/bundle.js"
  # file: "bundle.js"
  entitlements: {
    new_window:  yes
  }
  mount_points: {
    dashboard_vis: no
    dashboard_tile: yes
    standalone: no
  }
}
