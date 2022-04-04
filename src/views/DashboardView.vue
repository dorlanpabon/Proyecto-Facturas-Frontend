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
                        data-mdb-toggle="modal"
                        data-mdb-target="#DeleteInvoiceModal"
                        v-on:click.prevent="
                          async () => {
                            await getInvoice(invoice.id);
                            showModal = true;
                          }
                        "
                      >
                        <i class="fas fa-trash"></i>
                      </a>
                      <a
                        href="#"
                        class="btn btn-sm btn-warning"
                        v-on:click.prevent="
                          async () => {
                            await getInvoice(invoice.id);
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
          <div class="modal-body" v-if="invoice.id">
            <!-- Delete Invoice -->
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for=""
                    >¿Está seguro que desea eliminar la factura
                    {{ invoice.number }} || {{ invoice.date }} ||
                    {{ invoice.customer.name }} ?</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" v-if="invoice.id">
            <button
              type="button"
              class="btn btn-secondary"
              data-mdb-dismiss="modal"
            >
              Cerrar
            </button>

            <button
              type="button"
              class="btn btn-primary"
              v-on:click.prevent="
                async () => {
                  await deleteInvoice(invoice.id);
                  await getInvoices();
                }
              "
              data-mdb-dismiss="modal"
            >
              Eliminar
            </button>
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
      <div class="modal-dialog modal-xl">
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
          <div class="modal-body" v-if="invoice.id">
            <!-- Edit Invoice -->
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
                  <label for="">NIT Cliente</label>
                  <input
                    v-if="invoice.id"
                    type="text"
                    class="form-control"
                    v-model="invoice.customer.nit"
                    readonly
                  />
                </div>
              </div>
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
                      <th>Op</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in invoice.invoice_items"
                      :key="index"
                    >
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          v-model="item.item_id"
                          @change="updateInvoiceItemId({ item, index })"
                        />
                      </td>
                      <td>{{ item.description }}</td>
                      <td>
                        <input
                          type="number"
                          class="form-control"
                          v-model="item.quantity"
                          @change="updateInvoiceItem(invoice)"
                        />
                      </td>
                      <td>{{ item.price }}</td>
                      <td>{{ item.total }}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          v-on:click.prevent="deleteInvoiceItem(item.id)"
                        >
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6">
                        <button
                          type="button"
                          class="btn btn-success btn-sm"
                          v-on:click.prevent="addInvoiceItem()"
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-right"></td>
                      <td colspan="1" class="text-right">
                        <strong>Total sin IVA</strong>
                      </td>
                      <td>{{ invoice.total_without_iva }}</td>
                      <td colspan="1" class="text-right"></td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-right"></td>
                      <td colspan="1" class="text-right">
                        <strong>IVA</strong>
                      </td>
                      <td>{{ invoice.iva }}</td>
                      <td colspan="1" class="text-right"></td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-right"></td>
                      <td colspan="1" class="text-right">
                        <strong>Total</strong>
                      </td>
                      <td>{{ invoice.total_with_iva }}</td>
                      <td colspan="1" class="text-right"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer" v-if="invoice.id">
            <button
              type="button"
              class="btn btn-secondary"
              data-mdb-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-mdb-dismiss="modal"
              @click="updateInvoice(invoice)"
            >
              Guardar
            </button>
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
      "updateInvoice",
      "addInvoiceItem",
      "updateInvoiceItem",
      "deleteInvoiceItem",
      "updateInvoiceItemId",
    ]),
  },
  created() {
    this.getInvoices();
  },
};
</script>
