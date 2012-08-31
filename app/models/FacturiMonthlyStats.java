package models;

import play.db.jpa.Model;
import play.jobs.Job;

import javax.persistence.Entity;

@Entity
public class FacturiMonthlyStats extends Model
{
    public int month;

    public int year;

    public double payments; // plati

    public double receipts; // incasari

    public double vat;

    public double subtotal;

    public double total;
}