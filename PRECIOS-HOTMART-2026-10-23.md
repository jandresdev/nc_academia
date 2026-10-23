# Precios y enlaces Hotmart verificados · 23 de octubre de 2026

Fuente: los diez enlaces de checkout enviados por Ariset Muñoz el 21 de octubre de 2026. Se consultó el HTML público de cada checkout el 23 de octubre y se extrajo el importe en **USD** de la opción de pago PayPal que Hotmart devuelve para ese producto. Los medios locales aparecen en COP; su total puede variar según país, método de pago y configuración de Hotmart. Revisar siempre el total final antes de pagar. Los enlaces identifican los productos indicados, pero el checkout no resuelve por sí solo si el precio cubre una persona o el cupo completo del curso.

| Curso | Precio anterior en landing | Precio USD del checkout nuevo | Enlace nuevo |
|---|---:|---:|---|
| IA fácil para todos | USD 419,35 | **USD 395,00** | [Hotmart](https://pay.hotmart.com/C108128573H) |
| Marketing Total con IA | USD 548,39 | **USD 517,00** | [Hotmart](https://pay.hotmart.com/B108128594B) |
| Diseño Creativo con IA | USD 548,39 | **USD 517,00** | [Hotmart](https://pay.hotmart.com/T108128615V) |
| Publicidad Digital para Ads | USD 612,90 | **USD 578,00** | [Hotmart](https://pay.hotmart.com/X108128638G) |
| IA para Administrativos | USD 725,81 | **USD 684,00** | [Hotmart](https://pay.hotmart.com/M108128659D) |
| Automatización y Agentes de IA | USD 683,87 | **USD 684,00** | [Hotmart](https://pay.hotmart.com/D108128692T) |
| IA para Comerciales | USD 725,81 | **USD 684,00** | [Hotmart](https://pay.hotmart.com/D108128723O) |
| IA para Finanzas | USD 870,97 | **USD 821,00** | [Hotmart](https://pay.hotmart.com/N108128749B) |
| IA para Gerentes | USD 870,97 | **USD 821,00** | [Hotmart](https://pay.hotmart.com/G108128779M) |
| IA 360 para empresas | USD 2.000,00 | **USD 3.000,00** | [Hotmart](https://pay.hotmart.com/B108129220N) |

`assets/payment-links.json` es la fuente de precios USD y enlaces usada al generar las landings. `assets/commerce.json` conserva los datos de catálogo de la tienda, incluidos valores COP de otro canal, y no determina el precio USD mostrado. Ejecutar `python scripts/audit-hotmart.py` para volver a consultar los checkouts y comparar sus importes con `assets/payment-links.json` antes de una nueva publicación.
