package models;


import play.data.binding.As;

import javax.persistence.Embeddable;
import java.util.Date;

@Embeddable
public class History
{
    @As(value={"yyyy-MM-dd hh:mm:ss"})
    public Date dateCreated;

    @As(value={"yyyy-MM-dd hh:mm:ss"})
    public Date lastUpdated;

}
