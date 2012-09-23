package listener;

import models.Factura;
import models.FacturaItem;

import javax.persistence.*;
import java.sql.Time;
import java.util.Date;

public class FacturaListener {
    @PrePersist
    protected void onCreate(Factura factura) {
        factura.history.dateCreated = getCurrentDate();
        factura.history.lastUpdated = factura.history.dateCreated;

        updateTotals(factura);
    }

    @PreUpdate
    protected void onUpdate(Factura factura) {
        factura.history.lastUpdated = getCurrentDate();

        updateTotals(factura);
    }

    protected void updateTotals(Factura factura) {
        factura.subtotal = 0;
        factura.vat = 0;
        factura.total = 0;

        for (FacturaItem item : factura.items) {
            if (item != null) {
                factura.subtotal += item.subtotal;
                factura.vat += item.vatAmount;
                factura.total += item.total;
            }
        }
    }

    private Date getCurrentDate()
    {
        //return new java.sql.Date(Calendar.getInstance().getTime().getTime());
        return new Date(System.currentTimeMillis());
    }
}
