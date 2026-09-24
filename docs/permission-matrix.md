# Demo permission matrix

This matrix controls browser-side presentation and local mutation behavior only. It is not a
security boundary; every role, permission, fixture, and decision ships to the browser.

| Area              | Permission                             | Admin | Manager | Viewer |
| ----------------- | -------------------------------------- | :---: | :-----: | :----: |
| Dashboard         | `dashboard.view`                       |  Yes  |   Yes   |  Yes   |
| Customers         | `customers.view`                       |  Yes  |   Yes   |  Yes   |
| Customers         | `customers.create`, `customers.update` |  Yes  |   Yes   |   No   |
| Customers         | `customers.delete`                     |  Yes  |   No    |   No   |
| Projects          | `projects.view`                        |  Yes  |   Yes   |  Yes   |
| Projects          | `projects.create`, `projects.update`   |  Yes  |   Yes   |   No   |
| Projects          | `projects.delete`                      |  Yes  |   No    |   No   |
| Kanban            | `kanban.view`                          |  Yes  |   Yes   |  Yes   |
| Kanban            | `kanban.edit`, `kanban.move`           |  Yes  |   Yes   |   No   |
| Calendar          | `calendar.view`                        |  Yes  |   Yes   |  Yes   |
| Calendar          | `calendar.create`, `calendar.update`   |  Yes  |   Yes   |   No   |
| Calendar          | `calendar.delete`                      |  Yes  |   No    |   No   |
| Activity          | `activity.view`                        |  Yes  |   Yes   |  Yes   |
| Messages          | `messages.view`                        |  Yes  |   Yes   |  Yes   |
| Messages          | `messages.send`                        |  Yes  |   Yes   |   No   |
| Settings          | `settings.view`                        |  Yes  |   Yes   |  Yes   |
| UI kit and blocks | `showcase.view`                        |  Yes  |   Yes   |  Yes   |
| Charts            | `charts.view`                          |  Yes  |   Yes   |  Yes   |
| Maps              | `maps.view`                            |  Yes  |   Yes   |  Yes   |
| Editor            | `editor.view`                          |  Yes  |   Yes   |  Yes   |
| Local export      | `data.export`                          |  Yes  |   Yes   |   No   |
| Access inspection | `access-control.view`                  |  Yes  |   No    |   No   |
| Global demo reset | `demo.reset`                           |  Yes  |   No    |   No   |

Public routes are `/`, `/login`, and `/signup`. All listed application destinations require an
authenticated identity plus their mapped permission. Nested paths inherit only on a complete path
segment boundary. Unknown permissions and unmapped protected routes deny by default.
