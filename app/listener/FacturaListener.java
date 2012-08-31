package listener;

import models.Factura;
import models.FacturaItem;

import javax.persistence.*;
import java.util.Calendar;
import java.util.Date;

public class FacturaListener
{

    @PrePersist
    protected void onCreate(Factura factura)
    {
        factura.history.dateCreated = new Date();
        factura.history.lastUpdated = new Date();

        updateTotals(factura);
    }

    @PreUpdate
    protected void onUpdate(Factura factura)
    {
        factura.history.lastUpdated = new Date();

        updateTotals(factura);
    }

    protected void updateTotals(Factura factura)
    {
        factura.subtotal = 0;
        factura.vat = 0;
        factura.total = 0;

        for (FacturaItem item : factura.items)
        {
            factura.subtotal += item.subtotal;
            factura.vat += item.vatAmount;
            factura.total += item.total;
        }
    }
}
