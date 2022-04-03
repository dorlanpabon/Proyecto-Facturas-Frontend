<template>
  <NavOrigin />

  <main style="margin-top: 58px">
    <div class="container pt-4">
      <!--Section: Facturas de Venta-->
      <section class="mb-4">
        <div class="card">
          <div class="card-header text-center py-3">
            <h5 class="mb-0 text-center">
              <strong>Facturas de Venta</strong>
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th scope="col">N Fac</th>
                    <th scope="col">Fecha y Hora</th>
                    <th scope="col">Emisor</th>
                    <th scope="col">Receptor</th>
                    <th scope="col">Sin IVA</th>
                    <th scope="col">IVA</th>
                    <th scope="col">Total</th>
                    <th scope="col">Op</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in invoices" v-bind:key="invoice.id">
                    <th scope="row">{{ invoice.number }}</th>
                    <td>{{ invoice.date }}</td>
                    <td>{{ invoice.seller.name }}</td>
                    <td>{{ invoice.customer.name }}</td>
                    <td>{{ invoice.total_without_iva }}</td>
                    <td>{{ invoice.iva }}</td>
                    <td>{{ invoice.total_with_iva }}</td>
                    <td>
                      <a
                        href="#"
                        class="btn btn-sm btn-primary"
                        v-on:click.prevent="
                          async () => {
                            await getInvoice(invoice.id);
                            showModal = true;
                          }
                        "
                        data-mdb-toggle="modal"
                        data-mdb-target="#viewInvoiceModal"
                      >
                        <i class="fas fa-eye"></i>
                      </a>
                      <a
                        href="#"
                        class="btn btn-sm btn-danger"
                        v-on:click.prevent="deleteInvoice(invoice.id)"
                        data-mdb-toggle="modal"
                        data-mdb-target="#DeleteInvoiceModal"
                      >
                        <i class="fas fa-trash"></i>
                      </a>
                      <a
                        href="#"
                        class="btn btn-sm btn-warning"
                        v-on:click.prevent="
                          () => {
                            editInvoice(invoice.id);
                            showModal = true;
                          }
                        "
                        data-mdb-toggle="modal"
                        data-mdb-target="#EditInvoiceModal"
                      >
                        <i class="fas fa-edit"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <!--Section: Sales Performance KPIs-->

      <!--Section: Statistics with subtitles-->
      <!-- <section>
        <div class="row">
          <div class="col-xl-6 col-md-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between p-md-1">
                  <div class="d-flex flex-row">
                    <div class="align-self-center">
                      <i class="fas fa-pencil-alt text-info fa-3x me-4"></i>
                    </div>
                    <div>
                      <h4>Total Posts</h4>
                      <p class="mb-0">Monthly blog posts</p>
                    </div>
                  </div>
                  <div class="align-self-center">
                    <h2 class="h1 mb-0">18,000</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-md-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between p-md-1">
                  <div class="d-flex flex-row">
                    <div class="align-self-center">
                      <i class="far fa-comment-alt text-warning fa-3x me-4"></i>
                    </div>
                    <div>
                      <h4>Total Comments</h4>
                      <p class="mb-0">Monthly blog posts</p>
                    </div>
                  </div>
                  <div class="align-self-center">
                    <h2 class="h1 mb-0">84,695</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-6 col-md-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between p-md-1">
                  <div class="d-flex flex-row">
                    <div class="align-self-center">
                      <h2 class="h1 mb-0 me-4">$76,456.00</h2>
                    </div>
                    <div>
                      <h4>Total Sales</h4>
                      <p class="mb-0">Monthly Sales Amount</p>
                    </div>
                  </div>
                  <div class="align-self-center">
                    <i class="far fa-heart text-danger fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-md-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between p-md-1">
                  <div class="d-flex flex-row">
                    <div class="align-self-center">
                      <h2 class="h1 mb-0 me-4">$36,000.00</h2>
                    </div>
                    <div>
                      <h4>Total Cost</h4>
                      <p class="mb-0">Monthly Cost</p>
                    </div>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-wallet text-success fa-3x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> -->
      <!--Section: Statistics with subtitles-->
    </div>
    <!-- Modal View -->
    <div
      class="modal top fade"
      id="viewInvoiceModal"
      tabindex="-1"
      aria-labelledby="viewInvoiceModalLabel"
      aria-hidden="true"
      data-mdb-backdrop="true"
      data-mdb-keyboard="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewInvoiceModalLabel">Ver Factura</h5>
            <button
              type="button"
              class="btn-close"
              data-mdb-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="invoice.id">
            <!-- View details Invoce -->

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Número de Factura</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="invoice.number"
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Fecha de Factura</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="invoice.date"
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Nombre Cliente</label>
                  <input
                    v-if="invoice.id"
                    type="text"
                    class="form-control"
                    v-model="invoice.customer.name"
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Email Cliente</label>
                  <input
                    v-if="invoice.id"
                    type="text"
                    class="form-control"
                    v-model="invoice.customer.email"
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">NIT Vendedor</label>
                  <input
                    v-if="invoice.id"
                    type="text"
                    class="form-control"
                    v-model="invoice.seller.nit"
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Nombre Vendedor</label>
                  <input
                    v-if="invoice.id"
                    type="text"
                    class="form-control"
                    v-model="invoice.seller.name"
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="table-responsive">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in invoice.invoice_items"
                      :key="index"
                    >
                      <td>{{ item.item_id }}</td>
                      <td>{{ item.description }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.price }}</td>
                      <td>{{ item.total }}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-right"></td>
                      <td colspan="1" class="text-right">
                        <strong>Total sin IVA</strong>
                      </td>
                      <td>{{ invoice.total_without_iva }}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-right"></td>
                      <td colspan="1" class="text-right">
                        <strong>IVA</strong>
                      </td>
                      <td>{{ invoice.iva }}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-right"></td>
                      <td colspan="1" class="text-right">
                        <strong>Total</strong>
                      </td>
                      <td>{{ invoice.total_with_iva }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-mdb-dismiss="modal"
            >
              Cerrar
            </button>
            <button type="button" class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Delete -->
    <div
      class="modal top fade"
      id="DeleteInvoiceModal"
      tabindex="-1"
      aria-labelledby="DeleteInvoiceModalLabel"
      aria-hidden="true"
      data-mdb-backdrop="true"
      data-mdb-keyboard="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="DeleteInvoiceModalLabel">
              Edliminar Factura
            </h5>
            <button
              type="button"
              class="btn-close"
              data-mdb-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-mdb-dismiss="modal"
            >
              Cerrar
            </button>
            <button type="button" class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Edit -->
    <div
      class="modal top fade"
      id="EditInvoiceModal"
      tabindex="-1"
      aria-labelledby="EditInvoiceModalLabel"
      aria-hidden="true"
      data-mdb-backdrop="true"
      data-mdb-keyboard="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="EditInvoiceModalLabel">
              Editar Factura
            </h5>
            <button
              type="button"
              class="btn-close"
              data-mdb-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-mdb-dismiss="modal"
            >
              Cerrar
            </button>
            <button type="button" class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<script>
// @ is an alias to /src
import NavOrigin from "../components/Nav.vue";
import { mapActions, mapGetters } from "vuex";
//import ModalViewInvoices from "../components/Modal.vue";

export default {
  name: "DashboardView",
  components: {
    NavOrigin,
    //ModalViewInvoices,
  },
  data() {
    return {
      showModal: false,
      //
    };
  },
  computed: {
    ...mapGetters(["invoices", "invoice"]),
  },
  methods: {
    ...mapActions([
      "getInvoices",
      "axiosToken",
      "getInvoice",
      "deleteInvoice",
      "editInvoice",
    ]),
  },
  created() {
    this.getInvoices();
  },
};
</script>
